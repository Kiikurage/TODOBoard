import { useState } from 'react';
import { Task } from '../model/Task';
import { useSaveTask, useTasks } from './useTasks';
import { TaskView } from './TaskView';
import { css } from '@emotion/react';
import { throwError } from '../lib/throwError';

export function BoardView() {
    const tasks = useTasks();
    const saveTask = useSaveTask();

    const [title, setTitle] = useState('');
    const [taskId1, setTaskId1] = useState('');
    const [taskId2, setTaskId2] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;
        saveTask(
            Task.create({
                id: '' + Math.random(),
                title,
                completed: false,
                description: '',
                x: 0,
                y: 0,
                dependencies: new Set(),
            }),
        );
        setTitle('');
    };

    const handleAddDependencyButtonClick = () => {
        const task1 = tasks.get(taskId1) ?? throwError(`Task ${taskId1} is not found`);
        const task2 = tasks.get(taskId2) ?? throwError(`Task ${taskId2} is not found`);

        console.log(`${task1.title} から ${task2.title} へ依存関係`);
        console.dir(task1);
        console.dir(task2);
        saveTask(task1.addDependency(task2.id));
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
            </div>
        </div>
    );
}
