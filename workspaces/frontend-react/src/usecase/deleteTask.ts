import { relationshipStorage, taskStorage } from '../deps';

export function deleteTask(taskId: string) {
    const relationships = relationshipStorage.readAll();

    for (const relationship of relationships.values()) {
        if (relationship.sourceTaskId === taskId || relationship.destinationTaskId === taskId) {
            relationshipStorage.deleteById(relationship.id);
        }
    }

    taskStorage.deleteById(taskId);
}
