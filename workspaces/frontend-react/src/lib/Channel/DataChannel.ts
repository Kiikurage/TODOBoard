import { Channel } from './Channel';
export class DataChannel<T> extends Channel<T> {
    constructor(private value: T) {
        super();
    }

    fire(value: T) {
        this.value = value;
        super.fire(value);
    }

    get(): T {
        return this.value;
    }

    map<U>(transform: (value: T) => U): DataChannel<U> {
        const channel = new DataChannel(transform(this.value));

        this.addListener((value) => channel.fire(transform(value)));

        return channel;
    }
}
