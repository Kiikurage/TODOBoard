import { useRef, useState } from 'react';
import { STYLE_CARD__ACTIVE } from './styles/card';
import { useDrag } from './hooks/useDrag';
import { TaskDraft } from '../usecase/createAndSaveNewTask';

export function CreateNewTaskFormCard({
    taskDraft,
    onChange,
    onSubmit,
}: {
    taskDraft: TaskDraft;
    onChange?: (taskDraft: TaskDraft) => void;
    onSubmit?: (taskDraft: TaskDraft) => void;
}) {
    const originalTaskPositionRef = useRef<{ x: number; y: number }>({ x: taskDraft.x, y: taskDraft.y });
    const { handleMouseDown: handleDragHandleMouseDown } = useDrag({
        onDragStart: () => {
            originalTaskPositionRef.current = { x: taskDraft.x, y: taskDraft.y };
        },
        onDragEnd: (dragState) => {
            onChange?.({
                ...taskDraft,
                x: originalTaskPositionRef.current.x + (dragState.currentX - dragState.startX),
                y: originalTaskPositionRef.current.y + (dragState.currentY - dragState.startY),
            });
        },
        onDragMove: (dragState) => {
            onChange?.({
                ...taskDraft,
                x: originalTaskPositionRef.current.x + (dragState.currentX - dragState.startX),
                y: originalTaskPositionRef.current.y + (dragState.currentY - dragState.startY),
            });
        },
    });

    // const cardRef = useRef<HTMLDivElement | null>(null);
    // useResizeObserver(cardRef, (entry) => {
    //     updateTask(task.id, {width: entry.contentRect.width, height: entry.contentRect.height});
    // });

    // const handleMouseDown: MouseEventHandler<HTMLDivElement> = (ev) => {
    //     ev.preventDefault();
    //     onMouseDown?.(ev);
    // };

    return (
        <div
            // ref={cardRef}
            css={{
                ...STYLE_CARD__ACTIVE,
                position: 'absolute',
                top: taskDraft.y,
                left: taskDraft.x,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '10px 16px 10px 0',
                width: 400,
                transition: 'transform 160ms ease-in',
            }}
            // onMouseDown={handleMouseDown}
            // onMouseEnter={onMouseEnter}
            // onMouseLeave={onMouseLeave}
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
                onMouseDown={handleDragHandleMouseDown}
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
                <div
                    css={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                    }}
                >
                    <div
                        css={{
                            flex: '1 1 0',
                        }}
                    >
                        <span
                            css={{
                                fontSize: '0.75em',
                                color: '#666',
                                userSelect: 'text',
                            }}
                        >
                            新しいタスク
                        </span>
                        <TitleForm
                            value={taskDraft.title}
                            completed={false}
                            onChange={(title) => onChange?.({ ...taskDraft, title })}
                            autoFocus
                        />
                    </div>
                    <button onClick={() => onSubmit?.(taskDraft)}>作成</button>
                </div>
                <DescriptionForm
                    value={taskDraft.description}
                    onChange={(description) => onChange?.({ ...taskDraft, description })}
                />
            </div>
        </div>
    );
}

function TitleForm({
    value,
    completed,
    onChange,
    autoFocus = false,
}: {
    value: string;
    completed: boolean;
    onChange?: (value: string) => void;
    autoFocus?: boolean;
}) {
    const [isEditing, setEditing] = useState(autoFocus);
    const [draftValue, setDraftValue] = useState(value);

    const handleBlur = () => {
        setEditing(false);
        onChange?.(draftValue);
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
                onBlur={handleBlur}
                autoFocus
                placeholder="タスクのタイトル"
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
                placeholder="説明文を追加"
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
