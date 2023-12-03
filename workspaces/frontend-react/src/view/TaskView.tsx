import { useState } from 'react';
import { Task } from '../model/Task';
import { useDeleteTask, useSaveTask } from './useTasks';
import { css } from '@emotion/react';
import { useDrag } from './useDrag';

export function TaskView({ task }: { task: Task }) {
    const saveTask = useSaveTask();
    const deleteTask = useDeleteTask();
    const [dragState, handleDragHandleMouseDown] = useDrag({
        onDragEnd: (dragState) => {
            saveTask(
                task.copy({
                    y: task.y + (dragState.currentY - dragState.startY),
                    x: task.x + (dragState.currentX - dragState.startX),
                }),
            );
        },
    });

    return (
        <div
            css={css`
                position: absolute;
                top: ${task.y + (dragState.currentY - dragState.startY)}px;
                left: ${task.x + (dragState.currentX - dragState.startX)}px;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                gap: 16px;
                padding: 16px 16px 16px 0;
                border-radius: 4px;
                width: 400px;
                border: 1px solid #000;
                background: #fff;
            `}
        >
            <div
                css={css`
                    flex: 0 0 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-self: stretch;
                    cursor: move;
                `}
                onMouseDown={handleDragHandleMouseDown}
            >
                <span className="material-symbols-outlined">drag_indicator</span>
            </div>
            <div
                css={css`
                    flex: 0 0 auto;
                `}
            >
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(ev) => saveTask(task.setCompleted(ev.target.checked))}
                />
            </div>
            <div
                css={css`
                    flex: 1 1 0;
                `}
            >
                <TitleForm
                    value={task.title}
                    completed={task.completed}
                    onChange={(title) => saveTask(task.copy({ title }))}
                />
                <DescriptionForm
                    value={task.description}
                    onChange={(description) => {
                        saveTask(task.copy({ description }));
                    }}
                />
            </div>
            <button
                css={css`
                    flex: 0 0 auto;
                    vertical-align: middle;
                    background: none;
                    border: none;
                    color: #a00;
                    cursor: pointer;
                `}
                onClick={() => deleteTask(task.id)}
            >
                <span className="material-symbols-outlined">delete</span>
            </button>
        </div>
    );
}

function TitleForm({
    value,
    completed,
    onChange,
}: {
    value: string;
    completed: boolean;
    onChange: (value: string) => void;
}) {
    const [isEditing, setEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(value);

    const handleBlur = () => {
        setEditing(false);
        onChange(draftValue);
    };

    if (!isEditing) {
        return (
            <div
                css={css`
                    font-weight: bold;
                    ${completed &&
                    css`
                        color: #888;
                        text-decoration-line: line-through;
                    `}
                `}
                onDoubleClick={() => setEditing(true)}
            >
                {value}
            </div>
        );
    }

    return (
        <input
            type="text"
            value={draftValue}
            autoFocus
            onBlur={handleBlur}
            onChange={(ev) => setDraftValue(ev.target.value)}
        />
    );
}

function DescriptionForm({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const [isEditing, setEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(value);

    const handleBlur = () => {
        setEditing(false);
        onChange(draftValue);
    };

    if (!isEditing) {
        return (
            <div
                css={css`
                    font-size: 0.875em;
                    color: ${isEditing ? '#f00' : '#666'};
                `}
                onDoubleClick={() => setEditing(true)}
            >
                {value === '' ? '説明文を追加' : value}
            </div>
        );
    }

    return (
        <textarea value={draftValue} autoFocus onBlur={handleBlur} onChange={(ev) => setDraftValue(ev.target.value)} />
    );
}
