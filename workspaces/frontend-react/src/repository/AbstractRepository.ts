export abstract class AbstractRepository<T, SerializedT> {
    protected readonly callbacks = new Set<() => void>();
    protected models = new Map<string, T>();

    protected constructor(protected readonly localStorageKey: string) {
        this.models = this.loadFromLocalStorage();
        this.addListener(() => this.saveToLocalStorage());
    }

    addListener(callback: () => void) {
        this.callbacks.add(callback);
    }

    removeListener(callback: () => void) {
        this.callbacks.delete(callback);
    }

    readAll(): ReadonlyMap<string, T> {
        return this.models;
    }

    save(model: T) {
        this.models = new Map(this.models);
        this.models.set(this.getId(model), model);

        this.callbacks.forEach((callback) => callback());
    }

    deleteById(modelId: string) {
        this.models = new Map(this.models);
        this.models.delete(modelId);

        this.callbacks.forEach((callback) => callback());
    }

    protected abstract getId(model: T): string;

    protected abstract serialize(model: T): SerializedT;

    protected abstract deserialize(serializedModel: SerializedT): T;

    private saveToLocalStorage() {
        const serializedModels = [...this.models.values()].map((model) => this.serialize(model));

        localStorage.setItem(this.localStorageKey, JSON.stringify(serializedModels));
    }

    private loadFromLocalStorage(): Map<string, T> {
        let serializedModels: SerializedT[];
        try {
            serializedModels = JSON.parse(localStorage.getItem(this.localStorageKey) ?? '[]') as SerializedT[];
        } catch {
            serializedModels = [];
        }

        const models = serializedModels.map((serializedModel) => this.deserialize(serializedModel));

        const map = new Map<string, T>();
        for (const model of models) map.set(this.getId(model), model);

        return map;
    }
}
