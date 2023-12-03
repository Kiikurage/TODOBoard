import { useState } from 'react';
import { Task } from '../model/Task';
import { useSaveTask, useTasks } from './useTasks';
import { css } from '@emotion/react';

export function TodoList() {
    const tasks = useTasks();
    const saveTask = useSaveTask();

    const [title, setTitle] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;
        saveTask(new Task('' + Math.random(), title, false));
        setTitle('');
    };

    return (
        <div>
            <h1>TODOリスト</h1>

            <div>
                <input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} />
                <button onClick={handleAddTaskButtonClick}>追加</button>
            </div>

            <ul>
                {[...tasks.values()].map((task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(ev) => saveTask(task.setCompleted(ev.target.checked))}
                        />
                        <span
                            css={css`
                                ${task.completed &&
                                css`
                                    text-decoration-line: line-through;
                                `}
                            `}
                        >
                            {task.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
