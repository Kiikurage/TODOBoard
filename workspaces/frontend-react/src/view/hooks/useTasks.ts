import { singleton } from '../../lib/singleton';
import { Task } from '../../model/Task';
import { useFlow } from './useFlow';
import { readTasks } from '../../usecase/readTasks';

const flow = singleton(() => readTasks());

export function useTasks(): ReadonlyMap<string, Task> {
    return useFlow(flow());
}
