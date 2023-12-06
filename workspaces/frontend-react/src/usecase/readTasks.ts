import { taskStorage } from '../deps';
import { Task } from '../model/Task';
import { singleton } from '../lib/singleton';

export const readTasks = singleton(() => {
    return taskStorage.onChange.map((tasks) => {
        const map = new Map<string, Task>();
        for (const task of tasks.values()) {
            if (task.completed) continue;

            map.set(task.id, task);
        }

        return map as ReadonlyMap<string, Task>;
    });
});
