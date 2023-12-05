import { taskStorage } from '../deps';
import { Task } from '../model/Task';

export interface TaskDraft {
    title: string;
    description: string;
    x: number;
    y: number;
}

export function createAndSaveNewTask({ title, description, x, y }: TaskDraft): Task {
    const id = taskStorage.getNextId();
    const task = Task.create({
        id,
        title,
        description,
        x,
        y,
        completed: false,
        width: 100,
        height: 100,
    });
    taskStorage.save(task);

    return task;
}
