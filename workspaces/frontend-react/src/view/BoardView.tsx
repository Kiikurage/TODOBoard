import { MouseEvent, useState } from 'react';
import { useTasks } from './hook/useTasks';
import { TaskCard } from './TaskCard';
import { useLinks } from './hook/useLinks';
import { LinkView } from './LinkView';
import { createAndSaveNewTask, TaskDraft } from '../usecase/createAndSaveNewTask';
import { useDrag } from './hook/useDrag';
import { CreateNewTaskFormCard } from './CreateNewTaskFormCard';
import { useCreateLinkSession } from './hook/useCreateLinkSession';
import { CreateLinkView } from './CreateLinkView';
import { Task } from '../model/Task';
import { useDataChannel } from './hook/useDataChannel';

export function BoardView() {
    const tasks = useTasks();
    const links = useLinks();

    const linkDraftSession = useCreateLinkSession();
    const linkDraftDetail = useDataChannel(linkDraftSession.detail);

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
                    <CreateLinkView linkHandleDragState={linkHandleDragState} linkDraftSession={linkDraftSession} />
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
