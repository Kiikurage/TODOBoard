import { Tokenizer } from './Tokenizer';
import { Parser } from './Parser';

const source = `
model Rect {
    left: number
    top: number
    width: number
    height: number

    right: number = left + width
    bottom: number = top + height
    centerX: number = (left + right) / 2
    centerY: number = (top + bottom) / 2
}`;

const tokenizer = new Tokenizer();
const tokens = tokenizer.tokenize(source);

const parser = new Parser();
const tree = parser.parse(tokens);

console.log(JSON.stringify(tree, null, 2));
