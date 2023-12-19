import { Disposable } from '../lib/Disposable';
import { Channel } from '../lib/Channel';
import { ReactiveStateMachine } from '../lib/ReactiveStateMachine';

export abstract class Session<T> extends ReactiveStateMachine<T> {
    readonly onEnd = new Channel();

    protected constructor(initialState: T) {
        super(initialState);
    }

    [Disposable.dispose]() {
        this.onEnd.fire();
    }
}
