import { Token, Tokenizer } from './Tokenizer';
import { assert } from './assert';

export interface ModelNode {
    type: 'Model';
    name: string;
    fields: ModelFieldNode[];
}

type ModelFieldNode = ModelPropertyFieldNode | ModelReadonlyFieldNode | ModelReadWriteFieldNode;

export interface ModelPropertyFieldNode {
    type: 'ModelPropertyField';
    name: string;
    fieldType: FieldType;
}

export interface ModelReadonlyFieldNode {
    type: 'ModelReadonlyField';
    name: string;
    fieldType: FieldType;
    expression: string;
}

export interface ModelReadWriteFieldNode {
    type: 'ModelReadWriteField';
    name: string;
    fieldType: string;
    getter?: PropertyGetterNode;
    setter?: PropertySetterNode;
}

export type FieldType = 'string' | 'number' | 'boolean';

export interface PropertyGetterNode {
    type: 'PropertyGetter';
    expression: string;
}

export interface PropertySetterNode {
    type: 'PropertySetter';
    argumentName: string;
    statement: string;
}

export class Parser {
    private cursor = 0;
    private tokens: Token[] = [];

    get currentToken() {
        return this.tokens[this.cursor];
    }

    parse(tokens: Token[]): ModelNode {
        this.cursor = 0;
        this.tokens = tokens;
        return this.parseRoot();
    }

    private parseRoot(): ModelNode {
        this.skipWhiteSpaceOrNewLine();

        assert(this.consume().text === 'model', 'modelキーワードがありません');

        this.expectOneOrMoreWhiteSpace();

        const name = this.consume();
        assert(Tokenizer.isNormal(name.text), 'モデル名がありません');

        this.expectOneOrMoreWhiteSpaceOrNewLine();
        assert(this.consume().text === '{', '{がありません');

        const fields: ModelFieldNode[] = [];
        this.skipWhiteSpaceOrNewLine();
        while (this.currentToken.text !== '}') {
            fields.push(this.parseField());
            this.skipWhiteSpaceOrNewLine();
        }

        assert(this.consume().text === '}', '}がありません');

        return { type: 'Model', name: name.text, fields };
    }

    private parseField(): ModelFieldNode {
        this.skipWhiteSpaceOrNewLine();

        const name = this.consume();
        assert(Tokenizer.isNormal(name.text), 'フィールド名がありません');

        this.skipWhiteSpaces();

        assert(this.consume().text === ':', 'コロンがありません');

        this.skipWhiteSpaces();

        const type = this.consume();
        assert(Tokenizer.isNormal(type.text), '型名がありません');

        this.skipWhiteSpaces();

        if (this.currentToken.text === '=') return this.parseReadonlyField(name, type.text);
        if (this.currentToken.text === '{') return this.parseReadWriteField(name, type.text);

        this.skipWhiteSpaces();

        return { type: 'ModelPropertyField', name: name.text, fieldType: type.text as FieldType };
    }

    private parseReadonlyField(name: Token, fieldType: string): ModelReadonlyFieldNode {
        assert(this.consume().text === '=', 'イコールがありません');

        this.skipWhiteSpaces();

        // 行末まですべて読みだしてexpressionとする
        const expressionTokens = this.readUntilEndOfLine();

        return {
            type: 'ModelReadonlyField',
            name: name.text,
            fieldType: fieldType as FieldType,
            expression: expressionTokens.map((token) => token.text).join(''),
        };
    }

    private parseReadWriteField(name: Token, fieldType: string): ModelReadWriteFieldNode {
        assert(this.consume().text === '{', '{がありません');

        let getter = this.parsePropertyGetter();
        const setter = this.parsePropertySetter();
        if (getter == undefined) {
            // getterがsetterの後に指定されている場合もあるため。
            getter = this.parsePropertyGetter();
        }
        assert(getter !== undefined || setter !== undefined, 'getterとsetterのどちらか一方は必要です');

        this.skipWhiteSpaceOrNewLine();

        assert(this.consume().text === '}', '}がありません');

        return { type: 'ModelReadWriteField', name: name.text, fieldType, getter, setter };
    }

    private parsePropertyGetter(): PropertyGetterNode | undefined {
        this.skipWhiteSpaceOrNewLine();

        if (this.currentToken.text !== 'get') return undefined;
        this.consume();

        this.skipWhiteSpaces();

        assert(this.consume().text === '=', 'イコールがありません');

        this.skipWhiteSpaces();

        // 行末まですべて読みだしてexpressionとする
        const expressionTokens = this.readUntilEndOfLine();

        return {
            type: 'PropertyGetter',
            expression: expressionTokens
                .map((token) => token.text)
                .join('')
                .trim(),
        };
    }

    private parsePropertySetter(): PropertySetterNode | undefined {
        this.skipWhiteSpaceOrNewLine();

        if (this.currentToken.text !== 'set') return undefined;
        this.consume();

        this.skipWhiteSpaces();

        assert(this.consume().text === '(', '開きカッコがありません');

        this.skipWhiteSpaces();

        const argumentName = this.consume();
        assert(Tokenizer.isNormal(argumentName.text), '引数名がありません');

        this.skipWhiteSpaces();

        assert(this.consume().text === ')', '閉じカッコがありません');

        this.skipWhiteSpaces();

        assert(this.consume().text === '{', '{がありません');

        const statementTokens = this.readMultiLinesUntilChar('}');

        assert(this.consume().text === '}', '}がありません');

        return {
            type: 'PropertySetter',
            argumentName: argumentName.text,
            statement: statementTokens
                .map((token) => token.text)
                .join('')
                .trim(),
        };
    }

    // 条件を満たす限りトークンを読み飛ばす
    private skipWhile(condition: (token: Token) => boolean): void {
        while (this.cursor < this.tokens.length && condition(this.tokens[this.cursor])) this.cursor++;
    }

    private consume(): Token {
        assert(this.cursor < this.tokens.length, 'トークンがありません');

        const token = this.currentToken;
        this.cursor++;
        return token;
    }

    private expectOneOrMoreWhiteSpace(): void {
        assert(Tokenizer.isWhiteSpace(this.currentToken.text), '空白がありません');
        this.consume();
        this.skipWhile((token) => Tokenizer.isWhiteSpace(token.text));
    }

    private expectOneOrMoreWhiteSpaceOrNewLine(): void {
        assert(Tokenizer.isWhiteSpace(this.currentToken.text) || this.currentToken.text === '\n', '空白がありません');
        this.consume();
        this.skipWhile((token) => Tokenizer.isWhiteSpace(token.text) || token.text === '\n');
    }

    private skipWhiteSpaces(): void {
        this.skipWhile((token) => Tokenizer.isWhiteSpace(token.text));
    }

    private skipWhiteSpaceOrNewLine(): void {
        this.skipWhile((token) => Tokenizer.isWhiteSpace(token.text) || token.text === '\n');
    }

    private readUntilEndOfLine(): Token[] {
        const tokens: Token[] = [];
        while (this.cursor < this.tokens.length && this.currentToken.text !== '\n') {
            tokens.push(this.consume());
        }
        return tokens;
    }

    private readMultiLinesUntilChar(character: string): Token[] {
        const tokens: Token[] = [];
        while (this.cursor < this.tokens.length && this.currentToken.text !== character) {
            tokens.push(this.consume());
        }
        return tokens;
    }
}
