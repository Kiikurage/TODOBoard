import { Link } from '../model/Link';
import { ch } from '../lib/channel/ch';
import { singleton } from '../lib/singleton';
import { TaskRepository } from '../repository/TaskRepository';
import { LinkRepository } from '../repository/LinkRepository';

export function ReadLinksUseCase(taskRepository: TaskRepository, linkRepository: LinkRepository) {
    return singleton(() => {
        return ch.reactive((get) => {
            const tasks = get(taskRepository.onChange);
            const links = get(linkRepository.onChange);

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
}

export type ReadLinksUseCase = ReturnType<typeof ReadLinksUseCase>;
