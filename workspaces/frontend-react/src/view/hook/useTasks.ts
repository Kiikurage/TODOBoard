import { Task } from '../../model/Task';
import { useDataChannel } from './useDataChannel';
import { ReadTasksUseCase } from '../../usecase/ReadTasksUseCase';

export function useTasks(readTasks: ReadTasksUseCase): ReadonlyMap<string, Task> {
    return useDataChannel(readTasks());
}
