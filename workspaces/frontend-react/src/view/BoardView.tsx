import { MouseEvent, useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './TaskCard';
import { useRelationships } from './hooks/useRelationships';
import { RelationshipView } from './RelationshipView';
import { createAndSaveNewTask, TaskDraft } from '../usecase/createAndSaveNewTask';
import { useDrag } from './hooks/useDrag';
import { CreateNewTaskFormCard } from './CreateNewTaskFormCard';
import { useLinkDraft } from './useLinkDraft';
import { LinkDraftLayer } from './LinkDraftLayer';
import { Task } from '../model/Task';

export function BoardView() {
    const tasks = useTasks();
    const relationships = useRelationships();

    const {
        linkDraft,
        startLinkDraftSession,
        finishLinkDraftSession,
        setLinkDraftDestination,
        linkDraftSourceTask,
        linkDraftDestinationTask,
        isLinkDraftReady,
    } = useLinkDraft();

    const { dragState: linkHandleDragState, handleMouseDown: handleDraftStart } = useDrag({
        onDragEnd() {
            finishLinkDraftSession();
        },
    });

    const handleTaskCardMouseDown = (ev: MouseEvent, task: Task) => {
        startLinkDraftSession(task.id);
        handleDraftStart(ev);
    };

    const [taskDraft, setTaskDraft] = useState<TaskDraft>({
        title: '',
        description: '',
        x: -1,
        y: -1,
    });

    return (
        <div
            css={{
                position: 'fixed',
                inset: 0,
                userSelect: 'none',
                background: '#f8faff',
            }}
        >
            <div
                css={{
                    position: 'absolute',
                    inset: 0,
                }}
                onDoubleClick={(ev) =>
                    setTaskDraft((oldState) => ({
                        ...oldState,
                        x: ev.clientX,
                        y: ev.clientY,
                    }))
                }
            >
                {linkHandleDragState.isDragging && (
                    <LinkDraftLayer
                        linkHandleDragState={linkHandleDragState}
                        linkDraftSourceTask={linkDraftSourceTask}
                        linkDraftDestinationTask={linkDraftDestinationTask}
                        isLinkDraftReady={isLinkDraftReady}
                    />
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
                        onMouseDown={(ev) => handleTaskCardMouseDown(ev, task)}
                        onMouseEnter={() => setLinkDraftDestination(task.id)}
                        onMouseLeave={() => setLinkDraftDestination(null)}
                    />
                ))}
                {taskDraft.x !== -1 && taskDraft.y !== -1 && (
                    <CreateNewTaskFormCard
                        taskDraft={taskDraft}
                        onChange={(taskDraft) => setTaskDraft(taskDraft)}
                        onSubmit={(taskDraft) => {
                            createAndSaveNewTask(taskDraft);
                            setTaskDraft({
                                title: '',
                                description: '',
                                x: -1,
                                y: -1,
                            });
                        }}
                    />
                )}
            </div>

            <div
                css={{
                    position: 'absolute',
                    top: 0,
                    userSelect: 'text',
                }}
            >
                {/* Overlay UI layer */}
            </div>
        </div>
    );
}
