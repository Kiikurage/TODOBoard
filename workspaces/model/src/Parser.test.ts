import { Parser } from './Parser';
import { Tokenizer } from './Tokenizer';

describe('Parser', () => {
    describe('parser', () => {
        it('フィールドなし', () => {
            const tree = new Parser().parse(new Tokenizer().tokenize(`model Model {}`));

            expect(tree).toEqual({
                type: 'Model',
                name: 'Model',
                fields: [],
            });
        });

        it('フィールドなし2', () => {
            const tree = new Parser().parse(new Tokenizer().tokenize(`model Model {\n}`));

            expect(tree).toEqual({
                type: 'Model',
                name: 'Model',
                fields: [],
            });
        });

        it('プロパティフィールドが1つ', () => {
            const tree = new Parser().parse(new Tokenizer().tokenize(`model Model { x: number }`));

            expect(tree).toEqual({
                type: 'Model',
                name: 'Model',
                fields: [
                    {
                        type: 'ModelPropertyField',
                        name: 'x',
                        fieldType: 'number',
                    },
                ],
            });
        });

        it('プロパティフィールドが複数', () => {
            const tree = new Parser().parse(
                new Tokenizer().tokenize(`
                model Model { x: number y: string }
            `),
            );

            expect(tree).toEqual({
                type: 'Model',
                name: 'Model',
                fields: [
                    {
                        type: 'ModelPropertyField',
                        name: 'x',
                        fieldType: 'number',
                    },
                    {
                        type: 'ModelPropertyField',
                        name: 'y',
                        fieldType: 'string',
                    },
                ],
            });
        });

        it('Readonly', () => {
            const tree = new Parser().parse(
                new Tokenizer().tokenize(`
            model Model { 
                x: number = this.y + this.z
            }`),
            );

            expect(tree).toEqual({
                type: 'Model',
                name: 'Model',
                fields: [
                    {
                        type: 'ModelReadonlyField',
                        expression: 'this.y + this.z',
                        name: 'x',
                        fieldType: 'number',
                    },
                ],
            });
        });

        it('ReadWriteのsetter省略', () => {
            const tree = new Parser().parse(
                new Tokenizer().tokenize(`
            model Model { 
                x: number {
                    get = this.y + this.z
                }
            }`),
            );

            expect(tree).toEqual({
                type: 'Model',
                name: 'Model',
                fields: [
                    {
                        type: 'ModelReadWriteField',
                        name: 'x',
                        fieldType: 'number',
                        getter: {
                            type: 'PropertyGetter',
                            expression: 'this.y + this.z',
                        },
                    },
                ],
            });
        });

        it('ReadWriteのgetter省略', () => {
            const tree = new Parser().parse(
                new Tokenizer().tokenize(`
            model Model { 
                x: number {
                    set (value) { 
                        this.x = this.y + this.z 
                    }
                }
            }`),
            );

            expect(tree).toEqual({
                type: 'Model',
                name: 'Model',
                fields: [
                    {
                        type: 'ModelReadWriteField',
                        name: 'x',
                        fieldType: 'number',
                        setter: {
                            type: 'PropertySetter',
                            argumentName: 'value',
                            statement: 'this.x = this.y + this.z',
                        },
                    },
                ],
            });
        });
    });
});
