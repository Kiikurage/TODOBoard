import { taskStorage } from '../deps';
import { throwError } from '../lib/throwError';

export function unarchiveTask(taskId: string) {
    const task = taskStorage.readAll(true).get(taskId) ?? throwError(`Task ${taskId} is not found`);

    taskStorage.save(task.copy({ isArchived: false }));
}
