import { Task } from '../model/Task';
import { AbstractRepository } from './AbstractRepository';
import { Rect } from '../lib/geometry/Rect';
import { filterMapByValue } from '../lib/filterMap';
import { throwError } from '../lib/throwError';

export class TaskRepository extends AbstractRepository<Task, SerializedTask> {
    constructor() {
        super('TaskStorage');
    }

    readOpenTasksAll(): ReadonlyMap<string, Task> {
        return filterMapByValue(this.readAll(), (task) => !task.completed);
    }

    createAndSave(props: CreateTaskProps): Task {
        const id = this.getNextId();
        const task = Task.create({
            id,
            title: props.title,
            description: props.description,
            completed: false,
            rect: Rect.create({
                left: props.left,
                top: props.top,
                width: 100,
                height: 100,
            }),
        });
        this.save(task);

        return task;
    }

    update(taskId: string, props: UpdateTaskProps): Task {
        const oldTask = this.findById(taskId) ?? throwError(`Task #${taskId} is not found`);
        const newTask = oldTask.copy(props);

        if (newTask.equalTo(oldTask)) return oldTask;

        this.save(newTask);

        return newTask;
    }

    private getNextId(): string {
        return '' + (this.models.size + 1);
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

export interface CreateTaskProps {
    title: string;
    description: string;
    left: number;
    top: number;
}

export interface UpdateTaskProps {
    readonly rect?: Rect;
    readonly title?: string;
    readonly description?: string;
    readonly completed?: boolean;
}
