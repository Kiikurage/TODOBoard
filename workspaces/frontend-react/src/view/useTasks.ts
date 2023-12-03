import { Task } from '../model/Task';
import { useSyncExternalStore } from 'react';
import { taskStorage } from '../deps';

export function useTasks(): ReadonlyMap<string, Task> {
    return useSyncExternalStore(
        (callback) => {
            taskStorage.addListener(callback);
            return () => taskStorage.removeListener(callback);
        },
        () => taskStorage.readAll(),
    );
}
