import { Channel } from './Channel';

/**
 * 最後に通知した値を保持するチャネル。リアクティブな値のソースとして利用可能。
 */
export class DataChannel<T> extends Channel<T> {
    constructor(private value: T) {
        super();
    }

    fire(value: T) {
        if (value === this.value) return;

        this.value = value;
        super.fire(value);
    }

    get(): T {
        return this.value;
    }

    set(value: T): void;
    set(updater: (oldValue: T) => T): void;
    set(valueOrUpdater: T | ((oldValue: T) => T)) {
        if (valueOrUpdater instanceof Function) valueOrUpdater = valueOrUpdater(this.value);

        this.fire(valueOrUpdater);
    }

    map<U>(transform: (value: T) => U): DataChannel<U> {
        const channel = new DataChannel(transform(this.value));

        this.addListener((value) => channel.fire(transform(value)));

        return channel;
    }
}
