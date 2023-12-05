import { taskStorage } from '../deps';
import { flow } from '../lib/flow/Flow';
import { Task } from '../model/Task';

export function readTasks() {
    const tasksFlow = taskStorage.readAllAsFlow();

    return flow((get) => {
        const tasks = get(tasksFlow);

        const map = new Map<string, Task>();
        for (const task of tasks.values()) {
            if (task.completed) continue;

            map.set(task.id, task);
        }

        return map as ReadonlyMap<string, Task>;
    });
}
