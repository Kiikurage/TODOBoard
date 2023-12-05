import { MouseEvent, useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './TaskCard';
import { useLink } from './hooks/useLink';
import { LinkView } from './LinkView';
import { createAndSaveNewTask, TaskDraft } from '../usecase/createAndSaveNewTask';
import { useDrag } from './hooks/useDrag';
import { CreateNewTaskFormCard } from './CreateNewTaskFormCard';
import { useLinkDraftSession } from './useLinkDraftSession';
import { LinkDraftLayer } from './LinkDraftLayer';
import { Task } from '../model/Task';
import { useFlow } from './hooks/useFlow';

export function BoardView() {
    const tasks = useTasks();
    const links = useLink();

    const linkDraftSession = useLinkDraftSession();
    const linkDraftDetail = useFlow(linkDraftSession.detail);

    const { dragState: linkHandleDragState, handleMouseDown: handleDraftStart } = useDrag({
        onDragEnd() {
            linkDraftSession.finish();
        },
    });

    const handleTaskCardMouseDown = (ev: MouseEvent, task: Task) => {
        linkDraftSession.start(task.id);
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
                    <LinkDraftLayer linkHandleDragState={linkHandleDragState} linkDraftSession={linkDraftSession} />
                )}
                {[...links.values()].map((link) => (
                    <LinkView link={link} key={link.id} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard
                        task={task}
                        key={task.id}
                        active={linkDraftDetail.isActiveTask(task.id)}
                        onMouseDown={(ev) => handleTaskCardMouseDown(ev, task)}
                        onMouseEnter={() => linkDraftSession.setDestination(task.id)}
                        onMouseLeave={() => linkDraftSession.setDestination(null)}
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
