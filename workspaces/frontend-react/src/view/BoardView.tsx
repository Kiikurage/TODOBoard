import { useState } from 'react';
import { useTasks } from './useTasks';
import { TaskCard } from './TaskCard';
import { css } from '@emotion/react';
import { throwError } from '../lib/throwError';
import { useRelationships } from './useRelationships';
import { RelationshipView } from './RelationshipView';
import { createAndSaveNewTask } from '../usecase/createAndSaveNewTask';
import { createAndSaveNewRelationship } from '../usecase/createAndSaveNewRelationship';

export function BoardView() {
    const tasks = useTasks();
    const relationships = useRelationships();

    const [title, setTitle] = useState('');
    const [taskId1, setTaskId1] = useState('');
    const [taskId2, setTaskId2] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;

        createAndSaveNewTask({ title });
        setTitle('');
    };

    const handleAddDependencyButtonClick = () => {
        const task1 = tasks.get(taskId1) ?? throwError(`Task ${taskId1} is not found`);
        const task2 = tasks.get(taskId2) ?? throwError(`Task ${taskId2} is not found`);

        createAndSaveNewRelationship({
            sourceTaskId: task1.id,
            destinationTaskId: task2.id,
        });
    };

    return (
        <div
            css={css`
                position: fixed;
                inset: 0;
                z-index: 0;
                pointer-events: none;
                background: #f8faff;
            `}
        >
            <div
                css={css`
                    position: absolute;
                    inset: 0;

                    * {
                        pointer-events: auto;
                    }
                `}
            >
                {[...relationships.values()].map((relationship) => (
                    <RelationshipView relationship={relationship} key={relationship.id} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard task={task} key={task.id} />
                ))}
            </div>

            <div
                css={css`
                    z-index: 1;
                    pointer-events: all;
                `}
            >
                <div>
                    <input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} />
                    <button onClick={handleAddTaskButtonClick}>追加</button>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="依存元のタスクID"
                        value={taskId1}
                        onChange={(ev) => setTaskId1(ev.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="依存先のタスクID"
                        value={taskId2}
                        onChange={(ev) => setTaskId2(ev.target.value)}
                    />
                    <button onClick={handleAddDependencyButtonClick}>Dependencyの追加</button>
                </div>
            </div>
        </div>
    );
}
