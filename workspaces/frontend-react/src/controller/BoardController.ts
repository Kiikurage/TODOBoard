import { Channel } from '../lib/channel/Channel';
import { Point } from '../lib/geometry/Point';
import { DragSession } from './DragSession';
import { CreateLinkSession } from './CreateLinkSession';
import { createAndSaveNewLink, createAndSaveNewTask, taskRepository, updateTask } from '../deps';
import { MoveTaskSession } from './MoveTaskSession';
import { CreateTaskSession } from './CreateTaskSession';

export interface BoardControllerEvents {
    readonly onPointerDown: Channel<Point>;
    readonly onPointerMove: Channel<Point>;
    readonly onPointerUp: Channel<Point>;
    readonly onTaskPointerEnter: Channel<{ taskId: string; point: Point }>;
    readonly onTaskPointerLeave: Channel<{ taskId: string; point: Point }>;
    readonly onCreateTaskSessionStart: Channel<CreateTaskSession>;
    readonly onMoveTaskSessionStart: Channel<MoveTaskSession>;
    readonly onCreateLinkSessionStart: Channel<CreateLinkSession>;
}

export class BoardController implements BoardControllerEvents {
    public readonly onPointerDown = new Channel<Point>();
    public readonly onPointerMove = new Channel<Point>();
    public readonly onPointerUp = new Channel<Point>();
    public readonly onDragStart = new Channel<DragSession>();
    public readonly onTaskPointerEnter = new Channel<{ taskId: string; point: Point }>();
    public readonly onTaskPointerLeave = new Channel<{ taskId: string; point: Point }>();
    public readonly onCreateTaskSessionStart = new Channel<CreateTaskSession>();
    public readonly onMoveTaskSessionStart = new Channel<MoveTaskSession>();
    public readonly onCreateLinkSessionStart = new Channel<CreateLinkSession>();

    handleTaskDragStart(taskId: string, point: Point) {
        this.onMoveTaskSessionStart.fire(
            new MoveTaskSession(taskId, new DragSession(this, point), taskRepository(), updateTask()),
        );
    }

    handleCreateLinkStart(sourceTaskId: string, point: Point) {
        this.onCreateLinkSessionStart.fire(
            new CreateLinkSession(
                sourceTaskId,
                this,
                new DragSession(this, point),
                taskRepository(),
                createAndSaveNewLink(),
            ),
        );
    }

    handleDoubleClick(point: Point) {
        this.onCreateTaskSessionStart.fire(new CreateTaskSession(point, createAndSaveNewTask()));
    }

    handlePointerDown(point: Point) {
        this.onPointerDown.fire(point);
        this.onDragStart.fire(new DragSession(this, point));
    }

    handlePointerMove(point: Point) {
        this.onPointerMove.fire(point);
    }

    handlePointerUp(point: Point) {
        this.onPointerUp.fire(point);
    }

    handleTaskPointerEnter(taskId: string, point: Point) {
        this.onTaskPointerEnter.fire({ taskId, point });
    }

    handleTaskPointerLeave(taskId: string, point: Point) {
        this.onTaskPointerLeave.fire({ taskId, point });
    }
}