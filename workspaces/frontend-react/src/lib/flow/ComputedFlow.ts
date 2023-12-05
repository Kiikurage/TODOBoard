import { Flow } from './Flow';
import { AbstractFlow } from './AbstractFlow';

export class ComputedFlow<T> extends AbstractFlow<T> {
    private readonly cleanUps = new Set<() => void>();
    private value: T;

    constructor(private readonly compute: (get: <T>(flow: Flow<T>) => T) => T) {
        super();
        this.value = this.recompute();
    }

    private recompute(): T {
        for (const cleanUp of this.cleanUps) cleanUp();
        this.cleanUps.clear();

        const newValue = this.compute(<T>(flow: Flow<T>) => {
            this.cleanUps.add(flow.subscribe(() => this.recompute()));
            return flow.get();
        });

        this.value = newValue;
        this.dispatch();

        return newValue;
    }

    get(): T {
        return this.value;
    }
}
