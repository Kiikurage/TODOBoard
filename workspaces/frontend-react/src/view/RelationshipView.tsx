import { useTasks } from './hooks/useTasks';
import { Relationship } from '../model/Relationship';
import { throwError } from '../lib/throwError';

export function RelationshipView({ relationship }: { relationship: Relationship }) {
    const tasks = useTasks();

    const sourceTask = tasks.get(relationship.sourceTaskId) ?? throwError('Source task is not found');
    const destinationTask = tasks.get(relationship.destinationTaskId) ?? throwError('Destination task is not found');

    return (
        <svg
            width={window.innerWidth}
            height={window.innerHeight}
            stroke="#000"
            css={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
            }}
        >
            <line
                x1={sourceTask.x + sourceTask.width / 2}
                y1={sourceTask.y + sourceTask.height / 2}
                x2={destinationTask.x + destinationTask.width / 2}
                y2={destinationTask.y + destinationTask.height / 2}
            />
        </svg>
    );
}
