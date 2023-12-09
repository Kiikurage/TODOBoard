import { Reactive } from '../../lib/Reactive';

export interface Repository<T> extends Reactive {
    readAll(): ReadonlyMap<string, T>;

    findById(id: string): T | null;

    save(model: T): void;

    deleteById(id: string): void;
}
