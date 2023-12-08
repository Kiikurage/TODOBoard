import { Task } from '../model/Task';
import { singleton } from '../lib/singleton';
import { TaskRepository } from '../repository/TaskRepository';

export function ReadTasksUseCase(taskRepository: TaskRepository) {
    return singleton(() => {
        return taskRepository.onChange.map((tasks) => {
            const map = new Map<string, Task>();
            for (const task of tasks.values()) {
                if (task.completed) continue;

                map.set(task.id, task);
            }

            return map as ReadonlyMap<string, Task>;
        });
    });
}

export type ReadTasksUseCase = ReturnType<typeof ReadTasksUseCase>;
