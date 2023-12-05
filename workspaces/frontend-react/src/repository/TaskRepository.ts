import { Task } from '../model/Task';
import { AbstractRepository } from './AbstractRepository';

export class TaskRepository extends AbstractRepository<Task, SerializedTask> {
    constructor() {
        super('TaskStorage');
    }

    getNextId(): string {
        return '' + (this.models.size + 1);
    }

    readAll(): ReadonlyMap<string, Task> {
        return this.models;
    }

    protected serialize(model: Task): SerializedTask {
        return {
            id: model.id,
            title: model.title,
            completed: model.completed,
            description: model.description,
            x: model.x,
            y: model.y,
            width: model.width,
            height: model.height,
        };
    }

    protected deserialize(serializedModel: SerializedTask): Task {
        return Task.create({
            id: serializedModel.id,
            title: serializedModel.title,
            completed: serializedModel.completed,
            description: serializedModel.description,
            x: serializedModel.x,
            y: serializedModel.y,
            width: serializedModel.width ?? 100,
            height: serializedModel.height ?? 100,
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
    x: number;
    y: number;
    width: number;
    height: number;
}
