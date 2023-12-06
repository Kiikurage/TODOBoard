import { MouseEventHandler, useRef, useState } from 'react';
import { Task } from '../model/Task';
import { useDrag } from './hook/useDrag';
import { updateTask } from '../usecase/updateTask';
import { STYLE_CARD, STYLE_CARD__ACTIVE } from './style/card';
import { useResizeObserver } from './hook/useResizeObserver';
import { COLOR_ACTIVE } from './style/Colors';

export function TaskCard({
    task,
    active = false,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
}: {
    task: Task;
    active?: boolean;
    onMouseDown?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
}) {
    const originalTaskPositionRef = useRef<{ x: number; y: number }>({ x: task.x, y: task.y });
    const { handleMouseDown: handleDragHandleMouseDown } = useDrag({
        onDragStart: () => {
            originalTaskPositionRef.current = { x: task.x, y: task.y };
        },
        onDragEnd: (dragState) => {
            updateTask(task.id, {
                x: originalTaskPositionRef.current.x + (dragState.currentX - dragState.startX),
                y: originalTaskPositionRef.current.y + (dragState.currentY - dragState.startY),
            });
        },
        onDragMove: (dragState) => {
            updateTask(task.id, {
                x: originalTaskPositionRef.current.x + (dragState.currentX - dragState.startX),
                y: originalTaskPositionRef.current.y + (dragState.currentY - dragState.startY),
            });
        },
    });

    const cardRef = useRef<HTMLDivElement | null>(null);
    useResizeObserver(cardRef, (entry) => {
        updateTask(task.id, { width: entry.contentRect.width, height: entry.contentRect.height });
    });

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = (ev) => {
        ev.preventDefault();
        onMouseDown?.(ev);
    };

    return (
        <div
            ref={cardRef}
            css={{
                ...STYLE_CARD,
                position: 'absolute',
                top: task.y,
                left: task.x,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '10px 16px 10px 0',
                width: 400,
                transition: 'transform 160ms ease-in',
                ...(active && {
                    ...STYLE_CARD__ACTIVE,
                    outline: `2px solid ${COLOR_ACTIVE}`,
                }),
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                css={{
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignSelf: 'stretch',
                    cursor: 'move',
                    paddingRight: 4,
                }}
                onMouseDown={(ev) => {
                    ev.stopPropagation();
                    handleDragHandleMouseDown(ev);
                }}
            >
                <span
                    className="material-symbols-outlined"
                    css={{
                        fontSize: 20,
                        color: '#888',
                    }}
                >
                    drag_indicator
                </span>
            </div>
            <div
                css={{
                    flex: '1 1 0',
                    minWidth: 0,
                }}
            >
                <span
                    css={{
                        fontSize: '0.75em',
                        color: '#666',
                        userSelect: 'text',
                    }}
                >
                    #{task.id}
                </span>
                <TitleForm
                    value={task.title}
                    completed={task.completed}
                    onChange={(title) => updateTask(task.id, { title })}
                />
                <DescriptionForm
                    value={task.description}
                    onChange={(description) => updateTask(task.id, { description })}
                />
            </div>
            <div
                css={{
                    flex: '0 0 auto',
                }}
            >
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(ev) => updateTask(task.id, { completed: ev.target.checked })}
                />
            </div>
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
                css={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    userSelect: 'text',

                    ...(completed && {
                        color: '#888',
                        textDecorationLine: 'line-through',
                    }),
                }}
                onMouseDown={(ev) => ev.stopPropagation()}
                onDoubleClick={(ev) => {
                    ev.stopPropagation();
                    setEditing(true);
                }}
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
                css={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    '-webkit-line-clamp': '3',
                    '-webkit-box-orient': 'vertical',
                    textOverflow: 'ellipsis',
                    fontSize: '0.875em',
                    color: '#666',
                    userSelect: 'text',
                }}
                onMouseDown={(ev) => ev.stopPropagation()}
                onDoubleClick={(ev) => {
                    ev.stopPropagation();
                    setEditing(true);
                }}
            >
                {value === '' ? '説明文を追加' : value}
            </div>
        );
    }

    return (
        <textarea value={draftValue} autoFocus onBlur={handleBlur} onChange={(ev) => setDraftValue(ev.target.value)} />
    );
}
