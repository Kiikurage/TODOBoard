import { MouseEvent, useState } from 'react';
import { useTasks } from './hook/useTasks';
import { TaskCard } from './TaskCard';
import { useLinks } from './hook/useLinks';
import { LinkView } from './LinkView';
import { createAndSaveNewTask, TaskDraft } from '../usecase/createAndSaveNewTask';
import { useDrag } from './hook/useDrag';
import { CreateNewTaskFormCard } from './CreateNewTaskFormCard';
import { CreateLinkSessionView } from './CreateLinkSessionView';
import { Task } from '../model/Task';
import { CreateLinkSession } from './model/CreateLinkSession';
import { useDataChannel } from './hook/useDataChannel';

export function BoardView() {
    const tasks = useTasks();
    const links = useLinks();

    const createLinkSession = useState(() => new CreateLinkSession())[0];
    const createLinkSessionState = useDataChannel(createLinkSession.state);

    const { handleMouseDown: handleDraftStart } = useDrag({
        onDragMove(ev) {
            createLinkSession.setPosition(ev.currentX, ev.currentY);
        },
        onDragEnd() {
            createLinkSession.finish();
        },
    });

    const handleTaskCardMouseDown = (ev: MouseEvent, task: Task) => {
        createLinkSession.setSourceTaskId(task.id);
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
                {createLinkSessionState.isEditing && <CreateLinkSessionView createLinkSession={createLinkSession} />}
                {[...links.values()].map((link) => (
                    <LinkView link={link} key={link.id} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard
                        task={task}
                        key={task.id}
                        active={createLinkSessionState.isActiveTask(task.id)}
                        onMouseDown={(ev) => handleTaskCardMouseDown(ev, task)}
                        onMouseEnter={() => createLinkSession.setDestinationTaskId(task.id)}
                        onMouseLeave={() => createLinkSession.setDestinationTaskId(null)}
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
