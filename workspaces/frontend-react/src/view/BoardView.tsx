import { useState } from 'react';
import { Task } from '../model/Task';
import { useTasks } from './useTasks';
import { TaskView } from './TaskView';
import { css } from '@emotion/react';
import { throwError } from '../lib/throwError';
import { globalConfigStorage, relationshipStorage, taskStorage } from '../deps';
import { Relationship } from '../model/Relationship';
import { useRelationships } from './useRelationships';
import { RelationshipView } from './RelationshipView';
import { useGlobalConfig } from './useGlobalConfig';

export function BoardView() {
    const globalConfig = useGlobalConfig();
    const tasks = useTasks(globalConfig.showArchivedTasks);
    const relationships = useRelationships(globalConfig.showArchivedTasks);

    const [title, setTitle] = useState('');
    const [taskId1, setTaskId1] = useState('');
    const [taskId2, setTaskId2] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;
        taskStorage.save(
            Task.create({
                id: taskStorage.getNextId(),
                title,
                completed: false,
                description: '',
                isArchived: false,
                x: 0,
                y: 0,
            }),
        );
        setTitle('');
    };

    const handleAddDependencyButtonClick = () => {
        const task1 = tasks.get(taskId1) ?? throwError(`Task ${taskId1} is not found`);
        const task2 = tasks.get(taskId2) ?? throwError(`Task ${taskId2} is not found`);

        relationshipStorage.save(
            Relationship.create({
                sourceTaskId: task1.id,
                destinationTaskId: task2.id,
            }),
        );
    };

    return (
        <div>
            <div
                css={css`
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;

                    * {
                        pointer-events: auto;
                    }
                `}
            >
                {[...relationships.values()].map((relationship) => (
                    <RelationshipView relationship={relationship} key={relationship.id} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskView task={task} key={task.id} />
                ))}
            </div>

            <div
                css={css`
                    z-index: 1;
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
                <div>
                    <input
                        type="checkbox"
                        checked={globalConfig.showArchivedTasks}
                        onChange={(ev) => {
                            globalConfigStorage.save(globalConfig.copy({ showArchivedTasks: ev.target.checked }));
                        }}
                    />
                    削除済みのタスクもすべて表示する
                </div>
            </div>
        </div>
    );
}
