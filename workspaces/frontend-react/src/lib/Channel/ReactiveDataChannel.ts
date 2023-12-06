import { DataChannel } from './DataChannel';

export class ReactiveDataChannel<T> extends DataChannel<T> {
    private readonly wrappedCompute: () => T;

    constructor(compute: (get: <U>(channel: DataChannel<U>) => U) => T) {
        const cleanUpFunctions = new Set<() => void>();
        const wrappedCompute = () => {
            for (const cleanUp of cleanUpFunctions) cleanUp();
            cleanUpFunctions.clear();

            return compute(<U>(channel: DataChannel<U>) => {
                cleanUpFunctions.add(channel.addListener(() => this.recompute()));
                return channel.get();
            });
        };

        super(wrappedCompute());
        this.wrappedCompute = wrappedCompute;
    }

    private recompute() {
        this.fire(this.wrappedCompute());
    }
}
