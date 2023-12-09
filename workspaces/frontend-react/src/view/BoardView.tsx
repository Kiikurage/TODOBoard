import { useEffect, useState } from 'react';
import { useTasks } from './hook/useTasks';
import { TaskCard } from './TaskCard';
import { useLinks } from './hook/useLinks';
import { LinkView } from './LinkView';
import { CreateTaskForm } from './CreateTaskForm';
import { Point } from '../lib/geometry/Point';
import { boardController, readLinks, readTasks } from '../deps';
import { CreateLinkSession } from '../controller/CreateLinkSession';
import { CreateLinkView } from './CreateLinkView';
import { CreateTaskSession } from '../controller/CreateTaskSession';

export function BoardView() {
    const tasks = useTasks(readTasks());
    const links = useLinks(readLinks());

    const [createLinkSessions, setCreateLinkSessions] = useState<CreateLinkSession[]>([]);
    useEffect(() => {
        return boardController().onCreateLinkSessionStart.addListener((session) => {
            setCreateLinkSessions((oldState) => [...oldState, session]);
            session.onEnd.addListener(() => setCreateLinkSessions((oldState) => oldState.filter((s) => s !== session)));
        });
    }, []);

    const [createTaskSession, setCreateTaskSession] = useState<CreateTaskSession | null>(null);
    useEffect(() => {
        return boardController().onCreateTaskSessionStart.addListener((session) => {
            setCreateTaskSession(session);
            session.onEnd.addListener(() => setCreateTaskSession(null));
        });
    }, []);

    useEffect(() => {
        const handlePointerMove = (ev: MouseEvent) => {
            boardController().handlePointerMove(Point.create({ x: ev.clientX, y: ev.clientY }));
        };
        const handlePointerUp = (ev: MouseEvent) => {
            boardController().handlePointerUp(Point.create({ x: ev.clientX, y: ev.clientY }));
        };

        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
        };
    }, []);

    return (
        <div
            css={{
                position: 'fixed',
                inset: 0,
                userSelect: 'none',
                background: '#f8faff',
            }}
            onMouseDown={(ev) => {
                boardController().handlePointerDown(Point.create({ x: ev.clientX, y: ev.clientY }));
                window.getSelection()?.removeAllRanges?.();
            }}
        >
            <div
                css={{
                    position: 'absolute',
                    inset: 0,
                }}
                onDoubleClick={(ev) => {
                    boardController().handleDoubleClick(Point.create({ x: ev.clientX, y: ev.clientY }));
                }}
            >
                {[...links.values()].map((link) => (
                    <LinkView link={link} key={link.id} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard
                        task={task}
                        key={task.id}
                        board={boardController()}
                        active={createLinkSessions.some((session) => session.state.get().isActiveTask(task.id))}
                        onMouseDown={(ev) =>
                            boardController().handleCreateLinkStart(
                                task.id,
                                Point.create({ x: ev.clientX, y: ev.clientY }),
                            )
                        }
                        onMouseEnter={(ev) =>
                            boardController().handleTaskPointerEnter(
                                task.id,
                                Point.create({ x: ev.clientX, y: ev.clientY }),
                            )
                        }
                        onMouseLeave={(ev) =>
                            boardController().handleTaskPointerLeave(
                                task.id,
                                Point.create({ x: ev.clientX, y: ev.clientY }),
                            )
                        }
                        onResize={(width, height) =>
                            boardController().handleTaskUpdate(task.id, { rect: task.rect.copy({ width, height }) })
                        }
                        onTitleChange={(title) => boardController().handleTaskUpdate(task.id, { title })}
                        onDescriptionChange={(description) =>
                            boardController().handleTaskUpdate(task.id, { description })
                        }
                        onCompletedChange={(completed) => boardController().handleTaskUpdate(task.id, { completed })}
                    />
                ))}
                {createTaskSession !== null && <CreateTaskForm createTaskSession={createTaskSession} />}
                {createLinkSessions.map((session) => (
                    <CreateLinkView key={session.sourceTaskId} createLinkSession={session} />
                ))}
            </div>
        </div>
    );
}
