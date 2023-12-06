import { taskStorage } from '../deps';
import { throwError } from '../lib/throwError';
import { Task } from '../model/Task';
import { Rect } from '../lib/geometry/Rect';

export function updateTask(
    taskId: string,
    props: Partial<{
        rect: Rect;
        title: string;
        description: string;
        completed: boolean;
    }>,
): Task {
    const oldTask = taskStorage.readAll().get(taskId) ?? throwError(`Task #${taskId} is not found`);
    const newTask = oldTask.copy(props);

    if (newTask.equalTo(oldTask)) return oldTask;

    taskStorage.save(newTask);

    return newTask;
}
