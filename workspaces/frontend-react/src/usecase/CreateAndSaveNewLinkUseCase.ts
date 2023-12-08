import { Link } from '../model/Link';
import { LinkRepository } from '../repository/LinkRepository';

export function CreateAndSaveNewLinkUseCase(linkRepository: LinkRepository) {
    return function createAndSaveNewLink(sourceTaskId: string, destinationTaskId: string): Link {
        const existingLink = linkRepository.findById(Link.getId(sourceTaskId, destinationTaskId));
        if (existingLink !== undefined) return existingLink;

        const newLink = Link.create({ sourceTaskId, destinationTaskId });

        linkRepository.save(newLink);

        return newLink;
    };
}

export type CreateAndSaveNewLinkUseCase = ReturnType<typeof CreateAndSaveNewLinkUseCase>;
