import { Channel } from '../../lib/Channel';

export interface Repository<T> {
    readonly onChange: Channel<ReadonlyMap<string, T>>;

    readAll(): ReadonlyMap<string, T>;

    findById(id: string): T | null;

    save(model: T): void;

    deleteById(modelId: string): void;
}
