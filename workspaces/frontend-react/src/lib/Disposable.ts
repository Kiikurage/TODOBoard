export const SymbolDispose = Symbol('Disposable.dispose');

export interface Disposable {
    [SymbolDispose](): void;
}

export function dispose(disposable: Disposable) {
    disposable[SymbolDispose]();
}
