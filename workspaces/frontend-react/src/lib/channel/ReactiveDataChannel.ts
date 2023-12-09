import { DataChannel } from './DataChannel';

/**
 * 他のリアクティブな値に依存した値を表現するためのDataChannel
 */
export class ReactiveDataChannel<T> extends DataChannel<T> {
    private readonly wrappedCompute: () => T;

    /**
     * @param compute 値を計算する関数。引数のget関数は他のリアクティブな値を読み出すためのもので、
     *                このget関数に渡したDataChannelの値が変更されたときに、このDataChannelの値も自動的に再計算される。
     */
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
