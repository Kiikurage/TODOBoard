import { Task } from '../../model/Task';
import { useEffect, useState } from 'react';
import { taskStorage } from '../../deps';

export function useTasks(): ReadonlyMap<string, Task> {
    const [tasks, setTasks] = useState<ReadonlyMap<string, Task>>(() => taskStorage.readAll());

    useEffect(() => {
        const callback = () => setTasks(taskStorage.readAll());

        taskStorage.addListener(callback);
        return () => taskStorage.removeListener(callback);
    }, []);

    return tasks;
}
