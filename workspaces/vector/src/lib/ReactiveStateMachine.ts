import { Disposable, dispose } from './Disposable';
import { Channel } from './Channel';
import { Reactive } from './Reactive';

export abstract class ReactiveStateMachine<T> implements Reactive, Disposable {
    public readonly onChange = new Channel();

    private _state: T;

    protected constructor(initialState: T) {
        this._state = initialState;
    }

    get state() {
        return this._state;
    }

    protected set state(state: T) {
        this._state = state;
        this.onChange.fire();
    }

    [Disposable.dispose]() {
        dispose(this.onChange);
        dispose(this._state);
    }
}
