import { relationshipStorage } from '../deps';
import { Relationship } from '../model/Relationship';

export function createAndSaveNewRelationship({
    sourceTaskId,
    destinationTaskId,
}: {
    sourceTaskId: string;
    destinationTaskId: string;
}): Relationship {
    const existingRelationship = relationshipStorage.findById(Relationship.getId(sourceTaskId, destinationTaskId));
    if (existingRelationship !== undefined) return existingRelationship;

    const relationship = Relationship.create({ sourceTaskId, destinationTaskId });

    relationshipStorage.save(relationship);

    return relationship;
}
