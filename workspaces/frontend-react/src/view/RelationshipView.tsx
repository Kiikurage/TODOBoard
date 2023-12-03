import { useTasks } from './useTasks';
import { Relationship } from '../model/Relationship';
import { throwError } from '../lib/throwError';
import { css } from '@emotion/react';
import { useGlobalConfig } from './useGlobalConfig';

export function RelationshipView({ relationship }: { relationship: Relationship }) {
    const globalConfig = useGlobalConfig();
    const tasks = useTasks(globalConfig.showArchivedTasks);

    const sourceTask = tasks.get(relationship.sourceTaskId) ?? throwError('Source task is not found');
    const destinationTask = tasks.get(relationship.destinationTaskId) ?? throwError('Destination task is not found');

    return (
        <svg
            width={window.innerWidth}
            height={window.innerHeight}
            stroke="#000"
            css={css`
                position: fixed;
                inset: 0;
                pointer-events: none;
            `}
        >
            <line x1={sourceTask.x} y1={sourceTask.y} x2={destinationTask.x} y2={destinationTask.y} />
        </svg>
    );
}
