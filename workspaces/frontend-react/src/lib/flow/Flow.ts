import { WritableFlow } from './WritableFlow';
import { ComputedFlow } from './ComputedFlow';

export interface Flow<T> {
    get(): T;

    subscribe(callback: (value: T) => void): () => void;
}

export function flow<T>(compute: (getValue: <T>(val: Flow<T>) => T) => T): Flow<T>;
export function flow<T>(value: T): WritableFlow<T>;
export function flow<T>(arg: T | ((getValue: <T>(val: Flow<T>) => T) => T)): Flow<T> {
    if (arg instanceof Function) {
        return new ComputedFlow(arg);
    } else {
        return new WritableFlow(arg);
    }
}

export function asFlow<T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T): Flow<T> {
    const f = flow(getSnapshot());

    subscribe(() => f.set(getSnapshot()));

    return f;
}
