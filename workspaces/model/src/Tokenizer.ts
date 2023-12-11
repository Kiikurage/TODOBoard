export interface Token {
    // トークンの文字列
    text: string;
    from: number; // トークンの開始位置
    to: number; // トークンの終了位置(含まない)
}

export class Tokenizer {
    tokenize(source: string): Token[] {
        let cursor = 0;
        const tokens: Token[] = [];

        while (cursor < source.length) {
            {
                const from = cursor;
                while (cursor < source.length && Tokenizer.isWhiteSpace(source[cursor])) cursor++;
                if (cursor - from > 0) {
                    tokens.push(Tokenizer.token(source, from, cursor));
                }
            }
            if (cursor >= source.length) break;

            if (Tokenizer.isSpecialCharacter(source[cursor])) {
                tokens.push(Tokenizer.token(source, cursor, cursor + 1));
                cursor++;
            }
            if (cursor >= source.length) break;

            {
                const from = cursor;
                while (
                    cursor < source.length &&
                    !Tokenizer.isWhiteSpace(source[cursor]) &&
                    !Tokenizer.isSpecialCharacter(source[cursor])
                )
                    cursor++;
                if (cursor - from > 0) {
                    tokens.push(Tokenizer.token(source, from, cursor));
                }
            }
            if (cursor >= source.length) break;
        }

        return tokens;
    }

    public static isWhiteSpace(text: string): boolean {
        return /^[ \t\r]+$/.test(text);
    }

    public static isNormal(char: string): boolean {
        return !Tokenizer.isWhiteSpace(char) && !Tokenizer.isSpecialCharacter(char);
    }

    public static isSpecialCharacter(char: string): boolean {
        return (
            char === ':' ||
            char === '{' ||
            char === '}' ||
            char === '=' ||
            char === '(' ||
            char === ')' ||
            char === '\n'
        );
    }

    private static token(source: string, from: number, to: number): Token {
        return { text: source.substring(from, to), from, to };
    }
}
