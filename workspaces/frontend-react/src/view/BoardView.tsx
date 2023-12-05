import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './TaskCard';
import { useRelationships } from './hooks/useRelationships';
import { RelationshipView } from './RelationshipView';
import { createAndSaveNewTask } from '../usecase/createAndSaveNewTask';
import { createAndSaveNewRelationship } from '../usecase/createAndSaveNewRelationship';
import { useDrag } from './hooks/useDrag';
import { COLOR_ACTIVE } from './styles/Colors';

export function BoardView() {
    const tasks = useTasks();
    const relationships = useRelationships();

    const [title, setTitle] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;

        createAndSaveNewTask({ title });
        setTitle('');
    };

    const [linkDraft, setLinkDraft] = useState<{
        sourceTaskId: string | null;
        destinationTaskId: string | null;
    }>({ sourceTaskId: null, destinationTaskId: null });
    const { dragState: linkHandleDragState, handleMouseDown: handleTaskCardMouseDown } = useDrag({
        onDragEnd() {
            try {
                const { sourceTaskId, destinationTaskId } = linkDraft;
                if (sourceTaskId === null || destinationTaskId === null || sourceTaskId === destinationTaskId) {
                    return;
                }

                createAndSaveNewRelationship({ sourceTaskId, destinationTaskId });
            } finally {
                setLinkDraft({ sourceTaskId: null, destinationTaskId: null });
            }
        },
    });

    const linkDraftSourceTask = linkHandleDragState.isDragging
        ? linkDraft.sourceTaskId === null
            ? null
            : tasks.get(linkDraft.sourceTaskId) ?? null
        : null;
    const linkDraftDestinationTask = linkHandleDragState.isDragging
        ? linkDraft.destinationTaskId === null
            ? null
            : tasks.get(linkDraft.destinationTaskId) ?? null
        : null;

    const linkDraftX1 = linkDraftSourceTask ? linkDraftSourceTask.x + linkDraftSourceTask.width / 2 : null;
    const linkDraftY1 = linkDraftSourceTask ? linkDraftSourceTask.y + linkDraftSourceTask.height / 2 : null;
    const linkDraftX2 = linkDraftDestinationTask
        ? linkDraftDestinationTask.x + linkDraftDestinationTask.width / 2
        : linkHandleDragState.currentX;
    const linkDraftY2 = linkDraftDestinationTask
        ? linkDraftDestinationTask.y + linkDraftDestinationTask.height / 2
        : linkHandleDragState.currentY;
    const isLinkDraftReady =
        linkDraft.sourceTaskId !== null &&
        linkDraft.destinationTaskId !== null &&
        linkDraft.sourceTaskId !== linkDraft.destinationTaskId;

    return (
        <div
            css={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                userSelect: 'none',
                background: '#f8faff',
            }}
        >
            <div
                css={{
                    position: 'absolute',
                    inset: 0,
                }}
                onDoubleClick={() => console.log('DOUBLE CLICK')}
            >
                {linkHandleDragState.isDragging && linkDraftX1 && linkDraftY1 && (
                    <svg
                        width={window.innerWidth}
                        height={window.innerHeight}
                        strokeWidth={2}
                        strokeDasharray={isLinkDraftReady ? 'none' : '4 4'}
                        stroke={isLinkDraftReady ? COLOR_ACTIVE : '#aaa'}
                        css={{
                            position: 'fixed',
                            inset: 0,
                            pointerEvents: 'none',
                        }}
                    >
                        <line x1={linkDraftX1} y1={linkDraftY1} x2={linkDraftX2} y2={linkDraftY2} />
                    </svg>
                )}
                {[...relationships.values()].map((relationship) => (
                    <RelationshipView relationship={relationship} key={relationship.id} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard
                        task={task}
                        key={task.id}
                        active={
                            isLinkDraftReady &&
                            (linkDraft.sourceTaskId === task.id || linkDraft.destinationTaskId === task.id)
                        }
                        onMouseDown={(ev) => {
                            setLinkDraft((oldState) => ({ ...oldState, sourceTaskId: task.id }));
                            handleTaskCardMouseDown(ev);
                        }}
                        onMouseEnter={() => {
                            setLinkDraft((oldState) => ({ ...oldState, destinationTaskId: task.id }));
                        }}
                        onMouseLeave={() => {
                            setLinkDraft((oldState) => ({ ...oldState, destinationTaskId: null }));
                        }}
                    />
                ))}
            </div>

            <div
                css={{
                    zIndex: 1,
                    pointerEvents: 'all',
                }}
            >
                <div>
                    <input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} />
                    <button onClick={handleAddTaskButtonClick}>追加</button>
                </div>
            </div>
        </div>
    );
}
