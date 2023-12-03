import { Relationship } from '../model/Relationship';

const LOCAL_STORAGE_KEY = 'RelationshipStorage';

export class RelationshipRepository {
    private readonly callbacks = new Set<() => void>();
    private models = new Map<string, Relationship>();

    constructor() {
        this.models = this.loadFromLS();
        this.addListener(() => this.saveToLS());
    }

    addListener(callback: () => void) {
        this.callbacks.add(callback);
    }

    removeListener(callback: () => void) {
        this.callbacks.delete(callback);
    }

    readAll(): ReadonlyMap<string, Relationship> {
        return this.models;
    }

    save(task: Relationship) {
        this.models = new Map(this.models);
        this.models.set(task.id, task);

        this.callbacks.forEach((callback) => callback());
    }

    deleteById(modelId: string) {
        this.models = new Map(this.models);
        this.models.delete(modelId);

        this.callbacks.forEach((callback) => callback());
    }

    private serialize(model: Relationship): SerializedRelationship {
        return {
            sourceTaskId: model.sourceTaskId,
            destinationTaskId: model.destinationTaskId,
        };
    }

    private deserialize(serializedModel: SerializedRelationship): Relationship {
        return Relationship.create({
            sourceTaskId: serializedModel.sourceTaskId,
            destinationTaskId: serializedModel.destinationTaskId,
        });
    }

    private saveToLS() {
        const serializedModels = [...this.models.values()].map((model) => this.serialize(model));

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializedModels));
    }

    private loadFromLS(): Map<string, Relationship> {
        let serializedModels: SerializedRelationship[];
        try {
            serializedModels = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]') as SerializedRelationship[];
        } catch {
            serializedModels = [];
        }

        const models = serializedModels.map((serializedModel) => this.deserialize(serializedModel));

        const map = new Map<string, Relationship>();
        for (const model of models) map.set(model.id, model);

        return map;
    }
}

interface SerializedRelationship {
    sourceTaskId: string;
    destinationTaskId: string;
}
