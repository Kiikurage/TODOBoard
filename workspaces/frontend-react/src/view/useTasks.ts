import { Task } from '../model/Task';
import { useEffect, useState } from 'react';
import { taskStorage } from '../deps';

export function useTasks(includeArchivedTasks: boolean = false): ReadonlyMap<string, Task> {
    const [tasks, setTasks] = useState<ReadonlyMap<string, Task>>(() => taskStorage.readAll(includeArchivedTasks));

    useEffect(() => {
        const callback = () => setTasks(taskStorage.readAll(includeArchivedTasks));

        taskStorage.addListener(callback);
        return () => taskStorage.removeListener(callback);
    }, [includeArchivedTasks]);

    const [prevIncludeArchivedTasks, setPrevIncludeArchivedTasks] = useState(includeArchivedTasks);
    if (includeArchivedTasks !== prevIncludeArchivedTasks) {
        setTasks(taskStorage.readAll(includeArchivedTasks));
        setPrevIncludeArchivedTasks(includeArchivedTasks);
    }

    return tasks;
}
