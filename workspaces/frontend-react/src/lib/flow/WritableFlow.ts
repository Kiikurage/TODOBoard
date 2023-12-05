import { AbstractFlow } from './AbstractFlow';

export class WritableFlow<T> extends AbstractFlow<T> {
    constructor(public value: T) {
        super();
    }

    get(): T {
        return this.value;
    }

    set(value: T) {
        this.value = value;
        this.dispatch();
    }
}
