import { taskStorage } from '../deps';
import { Task } from '../model/Task';
import { Rect } from '../lib/geometry/Rect';

export interface TaskDraft {
    title: string;
    description: string;
    left: number;
    top: number;
}

export function createAndSaveNewTask({ title, description, left, top }: TaskDraft): Task {
    const id = taskStorage.getNextId();
    const task = Task.create({
        id,
        title,
        description,
        completed: false,
        rect: Rect.create({
            left,
            top,
            width: 100,
            height: 100,
        }),
    });
    taskStorage.save(task);

    return task;
}
