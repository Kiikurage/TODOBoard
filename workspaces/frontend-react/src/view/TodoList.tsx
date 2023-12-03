import { useState } from 'react';
import { Task } from '../model/Task';
import { useDeleteTask, useSaveTask, useTasks } from './useTasks';
import { css } from '@emotion/react';

export function TodoList() {
    const tasks = useTasks();
    const saveTask = useSaveTask();
    const deleteTask = useDeleteTask();

    const [title, setTitle] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;
        saveTask(
            Task.create({
                id: '' + Math.random(),
                title,
                completed: false,
                description: '',
            }),
        );
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
                    <li
                        key={task.id}
                        css={css`
                            display: flex;
                            flex-direction: row;
                            align-items: flex-start;
                            gap: 16px;
                            margin-bottom: 16px;
                        `}
                    >
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(ev) => saveTask(task.setCompleted(ev.target.checked))}
                        />
                        <div>
                            <div
                                css={css`
                                    font-weight: bold;
                                    ${task.completed &&
                                    css`
                                        color: #888;
                                        text-decoration-line: line-through;
                                    `}
                                `}
                            >
                                {task.title}
                            </div>
                            <div
                                css={css`
                                    font-size: 0.875em;
                                    color: #666;
                                `}
                            >
                                {task.description === '' ? '説明文を追加' : task.description}
                            </div>
                        </div>
                        <button
                            css={css`
                                line-height: 24px;
                                vertical-align: middle;
                            `}
                            onClick={() => deleteTask(task.id)}
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
