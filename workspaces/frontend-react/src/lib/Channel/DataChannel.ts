import { Channel } from './Channel';

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
