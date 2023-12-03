import { useState } from 'react';
import { Task } from '../model/Task';
import { useSaveTask, useTasks } from './useTasks';
import { TaskView } from './TaskView';
import { css } from '@emotion/react';

export function BoardView() {
    const tasks = useTasks();
    const saveTask = useSaveTask();

    const [title, setTitle] = useState('');

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
            }),
        );
        setTitle('');
    };

    return (
        <div>
            <div>
                <input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} />
                <button onClick={handleAddTaskButtonClick}>追加</button>
            </div>

            <div
                css={css`
                    position: fixed;
                    inset: 0;
                `}
            >
                {[...tasks.values()].map((task) => (
                    <TaskView task={task} key={task.id}></TaskView>
                ))}
            </div>
        </div>
    );
}
