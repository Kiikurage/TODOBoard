import { ReactiveDataChannel } from './ReactiveDataChannel';
import { DataChannel } from './DataChannel';
import { Channel } from './Channel';

export function ch<T>(): Channel<T> {
    return new Channel<T>();
}

export module ch {
    export function data<T>(value: T): DataChannel<T> {
        return new DataChannel<T>(value);
    }

    export function reactive<T>(compute: (get: <U>(channel: DataChannel<U>) => U) => T): ReactiveDataChannel<T> {
        return new ReactiveDataChannel<T>(compute);
    }
}
