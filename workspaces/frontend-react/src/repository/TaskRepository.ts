import { Task } from '../model/Task';
import { AbstractRepository } from './AbstractRepository';
import { Rect } from '../lib/geometry/Rect';

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
            rect: {
                left: model.rect.left,
                top: model.rect.top,
                width: model.rect.width,
                height: model.rect.height,
            },
        };
    }

    protected deserialize(serializedModel: SerializedTask): Task {
        return Task.create({
            id: serializedModel.id,
            title: serializedModel.title,
            completed: serializedModel.completed,
            description: serializedModel.description,
            rect: Rect.create(serializedModel.rect),
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
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}
