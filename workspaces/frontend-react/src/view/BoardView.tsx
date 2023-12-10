import { useEffect, useRef, useState } from 'react';
import { TaskCard } from './TaskCard';
import { LinkView } from './LinkView';
import { CreateTaskForm } from './CreateTaskForm';
import { Point } from '../lib/geometry/Point';
import { boardController } from '../deps';
import { CreateLinkView } from './CreateLinkView';
import { useReactive } from './hook/useReactive';
import { useResizeObserver } from './hook/useResizeObserver';
import { BoardViewController } from './controller/BoardViewController';

export function BoardView() {
    const viewController = useState(() => new BoardViewController(boardController()))[0];
    const controller = boardController();

    const tasks = useReactive(controller.taskRepository, (repository) => repository.readOpenTasksAll());
    const links = useReactive(controller.linkRepository, (repository) => repository.readAll());

    const { createLinkSession, createTaskSession } = useReactive(controller, (controller) => controller.state);
    const boardViewState = useReactive(viewController, (controller) => controller.state);

    useEffect(() => {
        window.addEventListener('pointermove', viewController.handlePointerMove);
        window.addEventListener('pointerup', viewController.handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', viewController.handlePointerMove);
            window.removeEventListener('pointerup', viewController.handlePointerUp);
        };
    }, [viewController.handlePointerMove, viewController.handlePointerUp]);

    const ref = useRef<HTMLDivElement | null>(null);
    useResizeObserver(ref, (entry) => {
        viewController.setDisplaySize(
            Point.create({
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
                viewController.handlePointerDown(ev.nativeEvent);
                window.getSelection()?.removeAllRanges?.();
            }}
        >
            <div css={{ pointerEvents: 'none', fontFamily: 'monospace' }}>
                <div>Updated at: {new Date().toISOString()}</div>
                <div>viewport: {'' + boardViewState.viewportRect}</div>
            </div>

            <div
                css={{
                    position: 'absolute',
                    inset: 0,
                }}
                onDoubleClick={(ev) => viewController.handleDoubleClick(ev.nativeEvent)}
            >
                {[...links.values()].map((link) => (
                    <LinkView link={link} key={link.id} boardViewState={boardViewState} />
                ))}
                {[...tasks.values()].map((task) => (
                    <TaskCard
                        task={task}
                        key={task.id}
                        boardViewState={boardViewState}
                        board={controller}
                        onPointerDown={(ev) =>
                            viewController.handleCreateLinkButtonPointerDown(ev.nativeEvent, task.id)
                        }
                        onPointerEnter={() => controller.handleTaskPointerEnter(task.id)}
                        onPointerLeave={() => controller.handleTaskPointerLeave(task.id)}
                        onTaskDragHandlePointerDown={(ev) =>
                            viewController.handleTaskDragHandlePointerDown(ev.nativeEvent, task.id)
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
                {createTaskSession !== null && (
                    <CreateTaskForm createTaskSession={createTaskSession} boardViewState={boardViewState} />
                )}
                {createLinkSession !== null && (
                    <CreateLinkView createLinkSession={createLinkSession} boardViewState={boardViewState} />
                )}
            </div>
        </div>
    );
}
