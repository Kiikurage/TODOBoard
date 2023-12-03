import { relationshipStorage } from '../deps';
import { Relationship } from '../model/Relationship';

export function createAndSaveNewRelationship({
    sourceTaskId,
    destinationTaskId,
}: {
    sourceTaskId: string;
    destinationTaskId: string;
}): Relationship {
    const relationship = Relationship.create({ sourceTaskId, destinationTaskId });
    relationshipStorage.save(relationship);

    return relationship;
}
