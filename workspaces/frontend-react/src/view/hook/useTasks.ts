import { Task } from '../../model/Task';
import { useDataChannel } from './useDataChannel';
import { readTasks } from '../../usecase/readTasks';

export function useTasks(): ReadonlyMap<string, Task> {
    return useDataChannel(readTasks());
}
