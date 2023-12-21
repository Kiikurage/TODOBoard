import { Channel, Disposable } from '../lib';
import { EditorState } from './EditorState';
import { InputReceiver } from './InputReceiver';
import { Logger } from '../lib/logger';

export class Editor extends Disposable {
    readonly onChange = this.register(new Channel<EditorState>());

    #state: EditorState = EditorState.create();
    private readonly inputReceiver = this.register(new InputReceiver());

    constructor() {
        super();

        this.inputReceiver.onInsert.addListener((text) => {
            this.setState(this.#state.insertText(text));
        });
        this.inputReceiver.onKeyDown.addListener((key) => {
            switch (key) {
                case 'Backspace':
                    this.removeBackward();
                    break;
                case 'Delete':
                    this.removeForward();
                    break;
                case 'ArrowLeft':
                    this.moveBackward();
                    break;
                case 'ArrowRight':
                    this.moveForward();
                    break;
                default:
                    logger.log(`onKeyDown key=${key}`);
            }
        });
        this.inputReceiver.onFocus.addListener(() => {
            this.setState(this.#state.copy({ focused: true }));
        });
        this.inputReceiver.onBlur.addListener(() => {
            this.setState(this.#state.copy({ focused: false }));
        });
        this.inputReceiver.onActivate.addListener(() => {
            this.setState(this.#state.copy({ active: true }));
        });
        this.inputReceiver.onDeactivate.addListener(() => {
            this.setState(this.#state.copy({ active: false }));
        });
    }

    get state() {
        return this.#state;
    }

    focus() {
        this.inputReceiver.focus();
    }

    blur() {
        this.inputReceiver.blur();
    }

    insertText(text: string) {
        this.setState(this.#state.insertText(text));
    }

    removeBackward() {
        this.setState(this.#state.removeBackward());
    }

    removeForward() {
        this.setState(this.#state.removeForward());
    }

    moveBackward() {
        this.setState(this.#state.moveBackward());
    }

    moveForward() {
        this.setState(this.#state.moveForward());
    }

    private setState(state: EditorState) {
        this.#state = state;
        this.onChange.fire(state);
    }
}

const logger = new Logger(Editor.name);
