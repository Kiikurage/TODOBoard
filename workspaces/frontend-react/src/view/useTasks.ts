import { TaskStorage } from './TaskStorage';
import { Task } from '../model/Task';
import { useCallback, useSyncExternalStore } from 'react';

const storage = new TaskStorage();

export function useTasks(): ReadonlyMap<string, Task> {
    return useSyncExternalStore(
        (callback) => {
            storage.addListener(callback);
            return () => storage.removeListener(callback);
        },
        () => storage.readAll(),
    );
}

export function useSaveTask() {
    return useCallback((task: Task) => {
        storage.save(task);
    }, []);
}

export function useDeleteTask() {
    return useCallback((taskId: string) => {
        storage.deleteById(taskId);
    }, []);
}
