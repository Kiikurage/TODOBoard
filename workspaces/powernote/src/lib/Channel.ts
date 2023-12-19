import { Disposable } from './Disposable';

/**
 * 登録されたリスナーへイベントを配信するチャネル
 */
export class Channel<T = void> implements Disposable {
    private readonly callbacks = new Set<(value: T) => void>();

    addListener(callback: (value: T) => void): () => void {
        this.callbacks.add(callback);
        return () => this.removeListener(callback);
    }

    removeListener(callback: (value: T) => void): this {
        this.callbacks.delete(callback);
        return this;
    }

    fire(value: T) {
        [...this.callbacks].forEach((callback) => callback(value));
    }

    [Disposable.dispose](): void {
        this.callbacks.clear();
    }
}
