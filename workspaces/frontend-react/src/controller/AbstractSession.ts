import { Disposable, dispose } from '../lib/Disposable';
import { Channel } from '../lib/Channel';
import { Session } from './Session';
import { ReactiveStateMachine } from '../lib/ReactiveStateMachine';

export abstract class AbstractSession<T> extends ReactiveStateMachine<T> implements Session<T> {
    public readonly onEnd = new Channel();

    protected constructor(initialState: T) {
        super(initialState);
    }

    [Disposable.dispose]() {
        this.onEnd.fire();
        dispose(this.onEnd);

        super[Disposable.dispose]();
    }
}
