import { useState } from 'react';
import { Task } from '../model/Task';
import { useDeleteTask, useSaveTask } from './useTasks';
import { css } from '@emotion/react';

export function TodoListItem({ task }: { task: Task }) {
    const saveTask = useSaveTask();
    const deleteTask = useDeleteTask();

    return (
        <li
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
                <DescriptionForm
                    value={task.description}
                    onChange={(description) => {
                        saveTask(task.copy({ description }));
                    }}
                />
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
    );
}

function DescriptionForm({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const [isDescriptionEditing, setDescriptionEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(value);

    const handleBlur = () => {
        setDescriptionEditing(false);
        onChange(draftValue);
    };

    if (!isDescriptionEditing) {
        return (
            <div
                css={css`
                    font-size: 0.875em;
                    color: ${isDescriptionEditing ? '#f00' : '#666'};
                `}
                onDoubleClick={() => setDescriptionEditing(true)}
            >
                {value === '' ? '説明文を追加' : value}
            </div>
        );
    }

    return (
        <textarea value={draftValue} autoFocus onBlur={handleBlur} onChange={(ev) => setDraftValue(ev.target.value)} />
    );
}
