/**
 * オブジェクトが破棄可能であることを表すインターフェース。
 * このインターフェースを実装するクラスは[Disposable.dispose]()が呼び出された際に、
 * そのオブジェクトが保持しているリソースを解放する必要がある。
 */
export interface Disposable {
    [Disposable.dispose](): void;
}

/**
 * オブジェクトを破棄する。
 */
export function dispose(disposable: unknown) {
    // call disposable[Disposable.dispose]() only if disposable has Disposable.dispose method.
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
