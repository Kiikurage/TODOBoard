import { Link } from '../model/Link';
import { ch } from '../lib/channel/ch';
import { singleton } from '../lib/singleton';
import { TaskRepository } from '../repository/TaskRepository';
import { LinkRepository } from '../repository/LinkRepository';

export function ReadLinksUseCase(taskRepository: TaskRepository, linkRepository: LinkRepository) {
    return singleton(() => {
        return ch.reactive((get) => {
            const tasks = get(taskRepository.onChange);
            const rawLinks = get(linkRepository.onChange);

            const map = new Map<string, Link>();

            for (const rawLink of rawLinks.values()) {
                const sourceTask = tasks.get(rawLink.sourceTaskId);
                const destinationTask = tasks.get(rawLink.destinationTaskId);
                if (sourceTask === undefined || destinationTask === undefined) {
                    console.error(`rawLink is corrupted. rawLink: ${JSON.stringify(rawLink)}`);
                    continue;
                }

                if (sourceTask.completed || destinationTask.completed) continue;

                const link = Link.create({ sourceTask, destinationTask });
                map.set(link.id, link);
            }

            return map;
        });
    });
}

export type ReadLinksUseCase = ReturnType<typeof ReadLinksUseCase>;
