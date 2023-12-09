import { Link } from '../model/Link';
import { LinkRepository } from '../repository/LinkRepository';
import { TaskRepository } from '../repository/TaskRepository';

export function ReadLinkByIdUseCase(taskRepository: TaskRepository, linkRepository: LinkRepository) {
    return function ReadLinkById(sourceTaskId: string, destinationTaskId: string): Link | undefined {
        const rawLink = linkRepository.findByTaskIds(sourceTaskId, destinationTaskId);
        if (rawLink === undefined) return undefined;

        const sourceTask = taskRepository.readAll().get(sourceTaskId);
        const destinationTask = taskRepository.readAll().get(destinationTaskId);
        if (sourceTask === undefined || destinationTask === undefined) {
            console.error(`rawLink is corrupted. rawLink: ${JSON.stringify(rawLink)}`);
            return undefined;
        }

        if (sourceTask.completed || destinationTask.completed) return undefined;

        return Link.create({ sourceTask, destinationTask });
    };
}

export type ReadLinkByIdUseCase = ReturnType<typeof ReadLinkByIdUseCase>;
