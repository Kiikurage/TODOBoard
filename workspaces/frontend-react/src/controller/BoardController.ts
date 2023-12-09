import { Channel } from '../lib/Channel';
import { Point } from '../lib/geometry/Point';
import { DragSession } from './DragSession';
import { CreateLinkSession } from './CreateLinkSession';
import { MoveTaskSession } from './MoveTaskSession';
import { CreateTaskSession } from './CreateTaskSession';
import { TaskRepository, UpdateTaskProps } from '../model/repository/TaskRepository';
import { LinkStorage } from '../model/storage/LinkStorage';

export interface BoardViewEvents {}

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

    constructor(
        public readonly taskRepository: TaskRepository,
        public readonly linkStorage: LinkStorage,
    ) {}

    handleTaskUpdate(taskId: string, props: UpdateTaskProps) {
        this.taskRepository.update(taskId, props);
    }

    handleTaskDragStart(taskId: string, point: Point) {
        this.onMoveTaskSessionStart.fire(
            new MoveTaskSession(taskId, new DragSession(this, point), this.taskRepository),
        );
    }

    handleCreateLinkStart(sourceTaskId: string, point: Point) {
        this.onCreateLinkSessionStart.fire(
            new CreateLinkSession(
                sourceTaskId,
                this,
                new DragSession(this, point),
                this.taskRepository,
                this.linkStorage,
            ),
        );
    }

    handleDoubleClick(point: Point) {
        this.onCreateTaskSessionStart.fire(new CreateTaskSession(point, this.taskRepository));
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
