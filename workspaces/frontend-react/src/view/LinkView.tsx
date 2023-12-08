import { useTasks } from './hook/useTasks';
import { Link } from '../model/Link';
import { throwError } from '../lib/throwError';
import { readTasks } from '../deps';

export function LinkView({ link }: { link: Link }) {
    const tasks = useTasks(readTasks());

    const sourceTask = tasks.get(link.sourceTaskId) ?? throwError('Source task is not found');
    const destinationTask = tasks.get(link.destinationTaskId) ?? throwError('Destination task is not found');

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
                x1={sourceTask.rect.center.x}
                y1={sourceTask.rect.center.y}
                x2={destinationTask.rect.center.x}
                y2={destinationTask.rect.center.y}
            />
        </svg>
    );
}
