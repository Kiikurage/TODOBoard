import { taskStorage } from '../deps';
import { Task } from '../model/Task';

export function createAndSaveNewTask({ title }: { title: string }): Task {
    const id = taskStorage.getNextId();
    const task = Task.create({
        id,
        title,
        description: '',
        completed: false,
        x: 100,
        y: 100,
    });
    taskStorage.save(task);

    return task;
}
