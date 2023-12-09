/**
 * オブジェクトが破棄可能であることを表すインターフェース。
 * このインターフェースを実装するクラスは[Disposable.dispose]()が呼び出された際に、
 * そのオブジェクトが保持しているリソースを解放する必要がある。
 */
export interface Disposable {
    [Disposable.dispose](): void;
}

/**
 * Disposableなオブジェクトを破棄する。
 */
export function dispose(disposable: Disposable) {
    disposable[Disposable.dispose]();
}

export module Disposable {
    export const dispose = Symbol('Disposable.dispose');
}
