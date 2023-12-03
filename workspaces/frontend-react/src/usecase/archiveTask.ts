import { taskStorage } from '../deps';
import { throwError } from '../lib/throwError';

export function archiveTask(taskId: string) {
    const task = taskStorage.readAll().get(taskId) ?? throwError(`Task ${taskId} is not found`);

    taskStorage.save(task.copy({ isArchived: true }));
}
