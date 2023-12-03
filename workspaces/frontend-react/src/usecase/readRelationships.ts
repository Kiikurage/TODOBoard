import { relationshipStorage, taskStorage } from '../deps';
import { Relationship } from '../model/Relationship';

export function readRelationships(): ReadonlyMap<string, Relationship> {
    const tasks = taskStorage.readAll();
    const relationships = relationshipStorage.readAll();

    const map = new Map<string, Relationship>();
    for (const relationship of relationships.values()) {
        const sourceTask = tasks.get(relationship.sourceTaskId);
        const destinationTask = tasks.get(relationship.destinationTaskId);
        if (sourceTask === undefined || destinationTask === undefined) continue;

        map.set(relationship.id, relationship);
    }

    return map;
}
