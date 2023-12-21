import { dataclass } from '../lib';

export class Cursor extends dataclass<{
    id: string;
    offset: number;
}>() {}
