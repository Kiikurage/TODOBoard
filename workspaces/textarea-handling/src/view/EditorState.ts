import { dataclass, throwError } from '../lib';
import { Cursor } from './Cursor';

export class EditorState extends dataclass<{
    value: string;
    cursors: Cursor[];
    active: boolean;
    focused: boolean;
}>() {
    static create(value: string = ''): EditorState {
        return new EditorState({
            value,
            cursors: [
                new Cursor({
                    id: '1',
                    offset: 0,
                }),
            ],
            active: false,
            focused: false,
        });
    }

    insertText(text: string) {
        let newState = this;
        for (const cursor of this.cursors) {
            newState = newState.insertTextAtCursor(cursor.id, text);
        }
        return newState;
    }

    insertTextAtCursor(cursorId: string, text: string) {
        const cursor = this.cursors.find((c) => c.id === cursorId) ?? throwError(`Cursor(id=${cursorId}) is not found`);
        const newValue = this.value.slice(0, cursor.offset) + text + this.value.slice(cursor.offset);
        const newCursors = this.cursors.map((c) => {
            if (c.offset < cursor.offset) {
                return c;
            } else {
                return c.copy({ offset: c.offset + text.length });
            }
        });

        return this.copy({ value: newValue, cursors: newCursors });
    }

    removeBackward() {
        let newState = this;
        for (const cursor of this.cursors) {
            newState = newState.removeBackwardAtCursor(cursor.id);
        }
        return newState;
    }

    removeBackwardAtCursor(cursorId: string) {
        const cursor = this.cursors.find((c) => c.id === cursorId) ?? throwError(`Cursor(id=${cursorId}) is not found`);
        if (cursor.offset === 0) return this;

        const newValue = this.value.slice(0, cursor.offset - 1) + this.value.slice(cursor.offset);
        const newCursors = this.cursors.map((c) => {
            if (c.offset < cursor.offset) {
                return c;
            } else {
                return c.copy({ offset: Math.max(0, c.offset - 1) });
            }
        });

        return this.copy({ value: newValue, cursors: newCursors });
    }

    removeForward() {
        let newState = this;
        for (const cursor of this.cursors) {
            newState = newState.removeForwardAtCursor(cursor.id);
        }
        return newState;
    }

    removeForwardAtCursor(cursorId: string) {
        const cursor = this.cursors.find((c) => c.id === cursorId) ?? throwError(`Cursor(id=${cursorId}) is not found`);
        if (cursor.offset === this.value.length) return this;

        const newValue = this.value.slice(0, cursor.offset) + this.value.slice(cursor.offset + 1);
        const newCursors = this.cursors.map((c) => {
            if (c.offset <= cursor.offset) {
                return c;
            } else {
                return c.copy({ offset: Math.max(0, c.offset - 1) });
            }
        });

        return this.copy({ value: newValue, cursors: newCursors });
    }
    moveBackward() {
        return this.copy({
            cursors: this.cursors.map((c) =>
                c.copy({
                    offset: Math.max(0, c.offset - 1),
                }),
            ),
        });
    }

    moveForward() {
        return this.copy({
            cursors: this.cursors.map((c) =>
                c.copy({
                    offset: Math.min(this.value.length, c.offset + 1),
                }),
            ),
        });
    }
}
