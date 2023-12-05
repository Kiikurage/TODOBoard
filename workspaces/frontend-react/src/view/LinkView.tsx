import { useTasks } from './hook/useTasks';
import { Link } from '../model/Link';
import { throwError } from '../lib/throwError';

export function LinkView({ link }: { link: Link }) {
    const tasks = useTasks();

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
                x1={sourceTask.x + sourceTask.width / 2}
                y1={sourceTask.y + sourceTask.height / 2}
                x2={destinationTask.x + destinationTask.width / 2}
                y2={destinationTask.y + destinationTask.height / 2}
            />
        </svg>
    );
}
