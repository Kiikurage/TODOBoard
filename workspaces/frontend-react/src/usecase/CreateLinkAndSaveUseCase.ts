import { throwError } from '../lib/throwError';
import { TaskRepository } from '../repository/TaskRepository';
import { Link } from '../model/Link';
import { LinkRepository } from '../repository/LinkRepository';
import { ReadLinkByIdUseCase } from './ReadLinkByIdUseCase';

export function CreateLinkAndSaveUseCase(
    taskRepository: TaskRepository,
    linkRepository: LinkRepository,
    readLinkById: ReadLinkByIdUseCase,
) {
    return function createLinkAndSave(sourceTaskId: string, destinationTaskId: string): Link {
        if (sourceTaskId === destinationTaskId) throwError(`Source task and destination task are the same`);
        taskRepository.readAll().get(sourceTaskId) ?? throwError(`Task #${sourceTaskId} is not found`);
        taskRepository.readAll().get(destinationTaskId) ?? throwError(`Task #${destinationTaskId} is not found`);

        linkRepository.createAndSave(sourceTaskId, destinationTaskId);
        const link = readLinkById(sourceTaskId, destinationTaskId);
        if (link === undefined) throwError('Failed to create link');

        return link;
    };
}

export type CreateLinkAndSaveUseCase = ReturnType<typeof CreateLinkAndSaveUseCase>;
