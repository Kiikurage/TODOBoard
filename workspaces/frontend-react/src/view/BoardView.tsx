import { useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { LinkView } from './LinkView';
import { CreateTaskForm } from './CreateTaskForm';
import { Point } from '../lib/geometry/Point';
import { boardController } from '../deps';
import { CreateLinkView } from './CreateLinkView';
import { useReactive } from './hook/useReactive';

export function BoardView() {
    const tasks = useReactive(boardController().taskRepository, (repository) => repository.readOpenTasksAll());
    const links = useReactive(boardController().linkRepository, (repository) => repository.readAll());

    const { createLinkSessions, createTaskSession } = useReactive(boardController(), (controller) => controller.state);

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
            <span css={{ pointerEvents: 'none', fontFamily: 'monospace' }}>Updated at: {new Date().toISOString()}</span>

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
