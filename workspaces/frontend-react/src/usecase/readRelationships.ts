import { relationshipStorage, taskStorage } from '../deps';
import { Relationship } from '../model/Relationship';
import { flow } from '../lib/flow/Flow';

export function readRelationships() {
    const tasksFlow = taskStorage.readAllAsFlow();
    const relationshipsFlow = relationshipStorage.readAllAsFlow();

    return flow((get) => {
        const tasks = get(tasksFlow);
        const relationships = get(relationshipsFlow);

        const map = new Map<string, Relationship>();
        for (const relationship of relationships.values()) {
            const sourceTask = tasks.get(relationship.sourceTaskId);
            const destinationTask = tasks.get(relationship.destinationTaskId);
            if (sourceTask === undefined || destinationTask === undefined) continue;
            if (sourceTask.completed || destinationTask.completed) continue;

            map.set(relationship.id, relationship);
        }

        return map as ReadonlyMap<string, Relationship>;
    });
}
