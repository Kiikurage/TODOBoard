import { throwError } from '../lib/throwError';
import { Task } from '../model/Task';
import { Rect } from '../lib/geometry/Rect';
import { TaskRepository } from '../repository/TaskRepository';

export function UpdateTaskUseCase(taskRepository: TaskRepository) {
    return function updateTask(taskId: string, props: UpdateTaskProps): Task {
        const oldTask = taskRepository.readAll().get(taskId) ?? throwError(`Task #${taskId} is not found`);
        const newTask = oldTask.copy(props);

        if (newTask.equalTo(oldTask)) return oldTask;

        taskRepository.save(newTask);

        return newTask;
    };
}

export type UpdateTaskUseCase = ReturnType<typeof UpdateTaskUseCase>;

export interface UpdateTaskProps {
    readonly rect?: Rect;
    readonly title?: string;
    readonly description?: string;
    readonly completed?: boolean;
}
