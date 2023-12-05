import { linkStorage } from '../deps';
import { Link } from '../model/Link';

export function createAndSaveNewLink({
    sourceTaskId,
    destinationTaskId,
}: {
    sourceTaskId: string;
    destinationTaskId: string;
}): Link {
    const existingLink = linkStorage.findById(Link.getId(sourceTaskId, destinationTaskId));
    if (existingLink !== undefined) return existingLink;

    const newLink = Link.create({ sourceTaskId, destinationTaskId });

    linkStorage.save(newLink);

    return newLink;
}
