import { Task } from '../model/Task';
import { Rect } from '../lib/geometry/Rect';
import { TaskRepository } from '../repository/TaskRepository';

export interface TaskDraft {
    title: string;
    description: string;
    left: number;
    top: number;
}

export function CreateAndSaveNewTaskUseCase(taskRepository: TaskRepository) {
    return function createAndSaveNewTask({ title, description, left, top }: TaskDraft): Task {
        const id = taskRepository.getNextId();
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
        taskRepository.save(task);

        return task;
    };
}

export type CreateAndSaveNewTaskUseCase = ReturnType<typeof CreateAndSaveNewTaskUseCase>;
