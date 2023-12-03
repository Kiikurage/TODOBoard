import { taskStorage } from '../deps';
import { throwError } from '../lib/throwError';

export function deleteTask(taskId: string) {
    const task = taskStorage.readAll().get(taskId) ?? throwError(`Task ${taskId} is not found`);
    // const relationships = relationshipStorage.readAll();
    //
    // for (const relationship of relationships.values()) {
    //     if (relationship.sourceTaskId === taskId || relationship.destinationTaskId === taskId) {
    //         relationshipStorage.deleteById(relationship.id);
    //     }
    // }

    taskStorage.save(task.copy({ isArchived: true }));
}
