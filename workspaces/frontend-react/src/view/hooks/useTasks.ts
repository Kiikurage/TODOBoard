import { singleton } from '../../lib/singleton';
import { Task } from '../../model/Task';
import { taskStorage } from '../../deps';
import { useFlow } from './useFlow';

const flow = singleton(() => taskStorage.readAllAsFlow());

export function useTasks(): ReadonlyMap<string, Task> {
    return useFlow(flow());
}
