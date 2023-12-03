import { TaskStorage } from '../storage/TaskStorage';
import { Task } from '../model/Task';
import { useCallback, useSyncExternalStore } from 'react';
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

export function useSaveTask() {
    return useCallback((task: Task) => {
        taskStorage.save(task);
    }, []);
}

export function useDeleteTask() {
    return useCallback((taskId: string) => {
        taskStorage.deleteById(taskId);
    }, []);
}

export function useMoveTaskToFront() {
    return useCallback((taskId: string) => {
        taskStorage.moveTaskToFront(taskId);
    }, []);
}
