import { useEffect, useRef } from 'react';
import { TaskCard } from './TaskCard';
import { LinkView } from './LinkView';
import { CreateTaskForm } from './CreateTaskForm';
import { Vector2 } from '../lib/geometry/Vector2';
import { CreateLinkView } from './CreateLinkView';
import { useReactive } from './hook/useReactive';
import { useResizeObserver } from './hook/useResizeObserver';
import { BoardViewController } from './controller/BoardViewController';
import { DebugView } from './DebugView';

export function BoardView({ controller }: { controller: BoardViewController }) {
    const tasks = useReactive(controller.taskRepository, (repository) => repository.readOpenTasksAll());
    const links = useReactive(controller.linkRepository, (repository) => repository.readAll());

    const boardViewState = useReactive(controller, (controller) => controller.state);

    useEffect(() => {
        window.addEventListener('pointermove', controller.handlePointerMove);
        window.addEventListener('pointerup', controller.handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', controller.handlePointerMove);
            window.removeEventListener('pointerup', controller.handlePointerUp);
        };
    }, [controller.handlePointerMove, controller.handlePointerUp]);

    const ref = useRef<HTMLDivElement | null>(null);
    useResizeObserver(ref, (entry) => {
        controller.setDisplaySize(
            new Vector2({
                x: entry.contentRect.width,
                y: entry.contentRect.height,
            }),
        );
    });

    return (
        <div
            ref={ref}
            css={{
                position: 'fixed',
                inset: 0,
                userSelect: 'none',
                background: '#f8faff',
            }}
            onPointerDown={(ev) => {
                controller.handlePointerDown(ev.nativeEvent);
                window.getSelection()?.removeAllRanges?.();
            }}
        >
            <div
                css={{
                    position: 'absolute',
                    inset: 0,
                }}
                onDoubleClick={(ev) => controller.handleDoubleClick(ev.nativeEvent)}
            >
                {[...links.values()].map((link) => (
                    <LinkView link={link} key={link.id} boardViewState={boardViewState} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard
                        task={task}
                        key={task.id}
                        boardViewState={boardViewState}
                        onPointerDown={(ev) => controller.handleCreateLinkButtonPointerDown(ev.nativeEvent, task.id)}
                        onPointerEnter={() => controller.handleTaskPointerEnter(task.id)}
                        onPointerLeave={() => controller.handleTaskPointerLeave(task.id)}
                        onTaskDragHandlePointerDown={(ev) =>
                            controller.handleTaskDragHandlePointerDown(ev.nativeEvent, task.id)
                        }
                        onResize={(width, height) =>
                            controller.taskRepository.update(task.id, { rect: task.rect.copy({ width, height }) })
                        }
                        onTitleChange={(title) => controller.taskRepository.update(task.id, { title })}
                        onDescriptionChange={(description) =>
                            controller.taskRepository.update(task.id, { description })
                        }
                        onCompletedChange={(completed) => controller.taskRepository.update(task.id, { completed })}
                    />
                ))}
                {boardViewState.boardState.createTaskSession !== null && (
                    <CreateTaskForm
                        createTaskSession={boardViewState.boardState.createTaskSession}
                        boardViewState={boardViewState}
                    />
                )}
                {boardViewState.boardState.createLinkSession !== null && (
                    <CreateLinkView
                        createLinkSession={boardViewState.boardState.createLinkSession}
                        boardViewState={boardViewState}
                    />
                )}
            </div>

            <DebugView controller={controller} />
        </div>
    );
}
