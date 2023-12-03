import { Task } from '../model/Task';
import { AbstractRepository } from './AbstractRepository';

export class TaskRepository extends AbstractRepository<Task, SerializedTask> {
    constructor() {
        super('TaskStorage');
    }

    getNextId(): string {
        return '' + (this.models.size + 1);
    }

    readAll(includeArchivedTasks: boolean = false): ReadonlyMap<string, Task> {
        if (includeArchivedTasks) {
            return this.models;
        }

        const map = new Map<string, Task>();
        for (const task of this.models.values()) {
            if (task.isArchived) continue;

            map.set(task.id, task);
        }

        return map;
    }

    protected serialize(model: Task): SerializedTask {
        return {
            id: model.id,
            title: model.title,
            completed: model.completed,
            description: model.description,
            isArchived: model.isArchived,
            x: model.x,
            y: model.y,
        };
    }

    protected deserialize(serializedModel: SerializedTask): Task {
        return Task.create({
            id: serializedModel.id,
            title: serializedModel.title,
            completed: serializedModel.completed,
            description: serializedModel.description,
            isArchived: serializedModel.isArchived ?? false,
            x: serializedModel.x,
            y: serializedModel.y,
        });
    }

    protected getId(model: Task): string {
        return model.id;
    }
}

interface SerializedTask {
    id: string;
    title: string;
    completed: boolean;
    description: string;
    isArchived: boolean;
    x: number;
    y: number;
}
