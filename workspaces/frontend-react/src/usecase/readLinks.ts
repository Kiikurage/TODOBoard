import { linkStorage, taskStorage } from '../deps';
import { Link } from '../model/Link';
import { ch } from '../lib/channel/ch';
import { singleton } from '../lib/singleton';

export const readLinks = singleton(() => {
    return ch.reactive((get) => {
        const tasks = get(taskStorage.onChange);
        const links = get(linkStorage.onChange);

        const map = new Map<string, Link>();

        for (const link of links.values()) {
            const sourceTask = tasks.get(link.sourceTaskId);
            const destinationTask = tasks.get(link.destinationTaskId);
            if (sourceTask === undefined || destinationTask === undefined) continue;
            if (sourceTask.completed || destinationTask.completed) continue;

            map.set(link.id, link);
        }

        return map;
    });
});
