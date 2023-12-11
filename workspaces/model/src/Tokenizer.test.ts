import { Tokenizer } from './Tokenizer';

describe('Tokenizer', () => {
    describe('tokenize', () => {
        it('1トークンのみ', () => {
            const tokens = new Tokenizer().tokenize('abc');

            expect(tokens).toEqual([{ text: 'abc', from: 0, to: 3 }]);
        });

        it('1トークン+空白', () => {
            const tokens = new Tokenizer().tokenize('  abc  ');

            expect(tokens).toEqual([
                { text: '  ', from: 0, to: 2 },
                { text: 'abc', from: 2, to: 5 },
                { text: '  ', from: 5, to: 7 },
            ]);
        });

        it('2トークンの間に空白', () => {
            const tokens = new Tokenizer().tokenize('  abc  def  ');

            expect(tokens).toEqual([
                { text: '  ', from: 0, to: 2 },
                { text: 'abc', from: 2, to: 5 },
                { text: '  ', from: 5, to: 7 },
                { text: 'def', from: 7, to: 10 },
                { text: '  ', from: 10, to: 12 },
            ]);
        });

        it('2トークンの間に改行', () => {
            const tokens = new Tokenizer().tokenize('\nabc\ndef\n');

            expect(tokens).toEqual([
                { text: '\n', from: 0, to: 1 },
                { text: 'abc', from: 1, to: 4 },
                { text: '\n', from: 4, to: 5 },
                { text: 'def', from: 5, to: 8 },
                { text: '\n', from: 8, to: 9 },
            ]);
        });

        it('2トークンの間にタブ', () => {
            const tokens = new Tokenizer().tokenize('\tabc\tdef\t');

            expect(tokens).toEqual([
                { text: '\t', from: 0, to: 1 },
                { text: 'abc', from: 1, to: 4 },
                { text: '\t', from: 4, to: 5 },
                { text: 'def', from: 5, to: 8 },
                { text: '\t', from: 8, to: 9 },
            ]);
        });

        it.each([':', '{', '}', '=', '(', ')', '\n'])('%sは1文字で独立したトークン扱いする', (char) => {
            const tokens = new Tokenizer().tokenize(`abc${char}def`);

            expect(tokens).toEqual([
                { text: 'abc', from: 0, to: 3 },
                { text: char, from: 3, to: 4 },
                { text: 'def', from: 4, to: 7 },
            ]);
        });

        //
        it('特殊トークンが2文字以上続いていた場合も、1文字ずつトークン扱いする', () => {
            const tokens = new Tokenizer().tokenize('abc==def');

            expect(tokens).toEqual([
                { text: 'abc', from: 0, to: 3 },
                { text: '=', from: 3, to: 4 },
                { text: '=', from: 4, to: 5 },
                { text: 'def', from: 5, to: 8 },
            ]);
        });
    });
});
