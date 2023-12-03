import { useRef, useState } from 'react';
import { Task } from '../model/Task';
import { css } from '@emotion/react';
import { useDrag } from './useDrag';
import { taskStorage } from '../deps';

export function TaskView({ task }: { task: Task }) {
    const originalTaskPositionRef = useRef<{ x: number; y: number }>({ x: task.x, y: task.y });
    const handleDragHandleMouseDown = useDrag({
        onDragStart: () => {
            originalTaskPositionRef.current = { x: task.x, y: task.y };
        },
        onDragEnd: (dragState) => {
            taskStorage.save(
                task.copy({
                    y: originalTaskPositionRef.current.y + (dragState.currentY - dragState.startY),
                    x: originalTaskPositionRef.current.x + (dragState.currentX - dragState.startX),
                }),
            );
        },
        onDragMove: (dragState) => {
            taskStorage.save(
                task.copy({
                    y: originalTaskPositionRef.current.y + (dragState.currentY - dragState.startY),
                    x: originalTaskPositionRef.current.x + (dragState.currentX - dragState.startX),
                }),
            );
        },
    });

    return (
        <div
            css={css`
                position: absolute;
                top: ${task.y}px;
                left: ${task.x}px;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                padding: 10px 16px 10px 0;
                border-radius: 4px;
                width: 400px;
                background: #fff;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.12),
                    0 1px 2px rgba(0, 0, 0, 0.24);
            `}
            // onMouseDown={() => taskStorage.moveTaskToFront(task.id)}
        >
            <div
                css={css`
                    flex: 0 0 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-self: stretch;
                    cursor: move;
                    padding-right: 4px;
                `}
                onMouseDown={handleDragHandleMouseDown}
            >
                <span
                    className="material-symbols-outlined"
                    css={css`
                        font-size: 20px;
                        color: #888;
                    `}
                >
                    drag_indicator
                </span>
            </div>
            <div
                css={css`
                    flex: 1 1 0;
                    min-width: 0;
                `}
            >
                <span
                    css={css`
                        font-size: 0.75em;
                        color: #666;
                    `}
                >
                    #{task.id}
                </span>
                <TitleForm
                    value={task.title}
                    completed={task.completed}
                    onChange={(title) => taskStorage.save(task.copy({ title }))}
                />
                <DescriptionForm
                    value={task.description}
                    onChange={(description) => {
                        taskStorage.save(task.copy({ description }));
                    }}
                />
            </div>
            <div
                css={css`
                    flex: 0 0 auto;
                `}
            >
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(ev) => taskStorage.save(task.copy({ completed: ev.target.checked }))}
                />
            </div>
            {/*{!task.isArchived && (*/}
            {/*    <button*/}
            {/*        css={css`*/}
            {/*            flex: 0 0 auto;*/}
            {/*            display: flex;*/}
            {/*            flex-direction: row;*/}
            {/*            align-items: center;*/}
            {/*            background: none;*/}
            {/*            border: none;*/}
            {/*            color: #a00;*/}
            {/*            cursor: pointer;*/}
            {/*        `}*/}
            {/*        onClick={() => archiveTask(task.id)}*/}
            {/*    >*/}
            {/*        <span className="material-symbols-outlined">archive</span> 削除*/}
            {/*    </button>*/}
            {/*)}*/}
            {/*{task.isArchived && (*/}
            {/*    <button*/}
            {/*        css={css`*/}
            {/*            flex: 0 0 auto;*/}
            {/*            display: flex;*/}
            {/*            flex-direction: row;*/}
            {/*            align-items: center;*/}
            {/*            background: none;*/}
            {/*            border: none;*/}
            {/*            color: #888;*/}
            {/*            cursor: pointer;*/}
            {/*        `}*/}
            {/*        onClick={() => {*/}
            {/*            console.log('click unarchiveTask');*/}
            {/*            unarchiveTask(task.id);*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <span className="material-symbols-outlined">unarchive</span> 復元*/}
            {/*    </button>*/}
            {/*)}*/}
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
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

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
        <div>
            <input
                type="text"
                value={draftValue}
                autoFocus
                onBlur={handleBlur}
                onChange={(ev) => setDraftValue(ev.target.value)}
            />
        </div>
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
                    display: -webkit-box;
                    overflow: hidden;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    text-overflow: ellipsis;
                    font-size: 0.875em;
                    color: #666;
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
