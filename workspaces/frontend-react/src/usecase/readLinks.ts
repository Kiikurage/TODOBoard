import { linkStorage, taskStorage } from '../deps';
import { Link } from '../model/Link';
import { flow } from '../lib/flow/Flow';

export function readLinks() {
    const tasksFlow = taskStorage.readAllAsFlow();
    const linksFlow = linkStorage.readAllAsFlow();

    return flow((get) => {
        const tasks = get(tasksFlow);
        const links = get(linksFlow);

        const map = new Map<string, Link>();
        for (const link of links.values()) {
            const sourceTask = tasks.get(link.sourceTaskId);
            const destinationTask = tasks.get(link.destinationTaskId);
            if (sourceTask === undefined || destinationTask === undefined) continue;
            if (sourceTask.completed || destinationTask.completed) continue;

            map.set(link.id, link);
        }

        return map as ReadonlyMap<string, Link>;
    });
}
