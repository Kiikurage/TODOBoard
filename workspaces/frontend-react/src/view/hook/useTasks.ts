import { Task } from '../../model/Task';
import { useEffect, useState } from 'react';
import { TaskRepository } from '../../repository/TaskRepository';

export function useTasks(taskRepository: TaskRepository): ReadonlyMap<string, Task> {
    const [tasks, setTasks] = useState(taskRepository.readOpenTasksAll());

    useEffect(
        () => taskRepository.onChange.addListener(() => setTasks(taskRepository.readOpenTasksAll())),
        [taskRepository],
    );

    return tasks;
}
