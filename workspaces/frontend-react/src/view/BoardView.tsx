import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './TaskCard';
import { throwError } from '../lib/throwError';
import { useRelationships } from './hooks/useRelationships';
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
            css={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                background: '#f8faff',
            }}
        >
            <div
                css={{
                    position: 'absolute',
                    inset: 0,

                    '*': {
                        pointerEvents: 'auto',
                    },
                }}
            >
                {[...relationships.values()].map((relationship) => (
                    <RelationshipView relationship={relationship} key={relationship.id} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard task={task} key={task.id} />
                ))}
            </div>

            <div
                css={{
                    zIndex: 1,
                    pointerEvents: 'all',
                }}
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
