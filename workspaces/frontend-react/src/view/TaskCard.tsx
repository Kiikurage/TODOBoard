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
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
            }}
        >
            <div
                css={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    gap: 4,
                }}
            >
                <DragHandle task={task} board={board} />
                <div
                    css={{
                        flex: '1 1 0',
                        minWidth: 0,
                        padding: '10px 0',
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
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '4px 4px',
                    }}
                >
                    <button
                        css={{
                            border: 'none',
                            // border: '1px solid #e0e0e0',
                            background: '#fff',
                            color: '#666',
                            borderRadius: 100,
                            padding: '0 8px',
                            cursor: 'pointer',
                            transition: 'background 80ms ease-out',
                            '&:hover': {
                                background: 'rgba(226,238,228,0.74)',
                            },
                            '&:active': {
                                background: 'rgba(193,217,197,0.74)',
                            },
                        }}
                        onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            onCompletedChange?.(true);
                        }}
                    >
                        <span className="material-symbols-outlined">check</span>
                    </button>
                    <button
                        css={{
                            border: 'none',
                            // border: '1px solid #e0e0e0',
                            background: '#fff',
                            color: '#666',
                            borderRadius: 100,
                            padding: '0 8px',
                            cursor: 'pointer',
                            transition: 'background 80ms ease-out',
                            '&:hover': {
                                background: 'rgba(226,233,238,0.74)',
                            },
                            '&:active': {
                                background: 'rgba(194,208,218,0.74)',
                            },
                        }}
                        onMouseDown={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            onMouseDown?.(ev);
                        }}
                    >
                        <span className="material-symbols-outlined">link</span>
                    </button>
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
                transition: 'background 80ms ease-out',

                '&:hover': {
                    background: 'rgba(226,233,238,0.74)',
                },
                '&:active': {
                    background: 'rgba(194,208,218,0.74)',
                },
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
                    color: '#666',
                }}
            >
                drag_indicator
            </span>
        </div>
    );
}
