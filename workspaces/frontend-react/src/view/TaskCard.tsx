import { MouseEventHandler, useRef, useState } from 'react';
import { Task } from '../model/Task';
import { STYLE_CARD, STYLE_CARD__ACTIVE_BORDERED } from './style/card';
import { useResizeObserver } from './hook/useResizeObserver';
import { STYLE_INPUT, STYLE_INPUT_FOCUSED } from './style/input';
import { BoardController } from '../controller/BoardController';
import { Point } from '../lib/geometry/Point';

export function TaskCard({
    board,
    task,
    active = false,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onResize,
    onTitleChange,
    onDescriptionChange,
    onCompletedChange,
}: {
    board: BoardController;
    task: Task;
    active?: boolean;
    onMouseDown?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
    onResize?: (width: number, height: number) => void;
    onTitleChange?: (title: string) => void;
    onDescriptionChange?: (description: string) => void;
    onCompletedChange?: (completed: boolean) => void;
}) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    useResizeObserver(cardRef, (entry) => {
        onResize?.(entry.contentRect.width, entry.contentRect.height);
    });

    return (
        <div
            ref={cardRef}
            css={{
                ...STYLE_CARD,
                position: 'absolute',
                top: task.rect.top,
                left: task.rect.left,
                width: 400,
                transition: 'transform 160ms ease-in',
                ...(active && {
                    ...STYLE_CARD__ACTIVE_BORDERED,
                }),
            }}
            onMouseDown={(ev) => {
                ev.preventDefault();
                onMouseDown?.(ev);
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                css={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '10px 16px 10px 0',
                }}
            >
                <DragHandle task={task} board={board} />
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
                    <TitleForm value={task.title} completed={task.completed} onChange={onTitleChange} />
                    <DescriptionForm value={task.description} onChange={onDescriptionChange} />
                </div>
                <div
                    css={{
                        flex: '0 0 auto',
                    }}
                >
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(ev) => onCompletedChange?.(ev.target.checked)}
                    />
                </div>
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
    onChange?: (value: string) => void;
}) {
    const [isEditing, setEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(value);

    const handleBlur = () => {
        setEditing(false);
        onChange?.(draftValue);
    };

    return (
        <input
            type="text"
            tabIndex={isEditing ? 0 : -1}
            readOnly={!isEditing}
            css={{
                ...STYLE_INPUT,
                borderBottomColor: 'transparent',

                ...(completed && {
                    textDecoration: 'line-through',
                }),
                ...(isEditing && STYLE_INPUT_FOCUSED),
            }}
            placeholder="タイトルを入力"
            value={draftValue}
            autoFocus
            onBlur={handleBlur}
            onChange={(ev) => setDraftValue(ev.target.value)}
            onMouseDown={(ev) => ev.stopPropagation()}
            onDoubleClick={
                isEditing
                    ? undefined
                    : (ev) => {
                          ev.stopPropagation();
                          setEditing(true);
                      }
            }
        />
    );
}

function DescriptionForm({ value, onChange }: { value: string; onChange?: (value: string) => void }) {
    const [isEditing, setEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(value);

    const handleBlur = () => {
        setEditing(false);
        onChange?.(draftValue);
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

function DragHandle({ task, board }: { task: Task; board: BoardController }) {
    return (
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
                board.handleTaskDragStart(task.id, Point.create({ x: ev.clientX, y: ev.clientY }));
                ev.stopPropagation();
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
    );
}
