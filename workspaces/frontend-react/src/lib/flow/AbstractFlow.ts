import { Flow } from './Flow';

export abstract class AbstractFlow<T> implements Flow<T> {
    public readonly subscribers = new Set<(value: T) => void>();

    abstract get(): T;

    protected dispatch() {
        const value = this.get();

        // callback呼び出し中に新しいsubscriberが追加される可能性もあるためsubscribersを複製しておく
        [...this.subscribers].forEach((callback) => callback(value));
    }

    subscribe(callback: (value: T) => void): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
}
