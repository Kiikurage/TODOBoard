export interface Disposable {
    [Disposable.dispose](): void;
}

export function dispose(disposable: unknown) {
    if (
        disposable !== null &&
        typeof disposable === 'object' &&
        Disposable.dispose in disposable &&
        typeof disposable[Disposable.dispose] === 'function'
    ) {
        disposable[Disposable.dispose]();
    }
}

export module Disposable {
    export const dispose = Symbol('Disposable.dispose');
}
