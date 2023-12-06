import { Task } from '../model/Task';
import { Channel } from '../lib/Channel/Channel';
import { TaskRepository } from '../repository/TaskRepository';

class State {
    constructor(
        public readonly currentX: number,
        public readonly currentY: number,
        public readonly sourceTaskId: string | null,
        public readonly sourceTask: Task | null,
        public readonly destinationTaskId: string | null,
        public readonly destinationTask: Task | null,
    ) {}

    copy(props: Partial<typeof ownProps>): State {
        return Object.assign(Object.create(State.prototype), this, props);
    }

    static create(props: typeof ownProps): State {
        return State.prototype.copy(props);
    }
}

const ownProps = { ...State.prototype };

export class CreateLinkSession {
    public readonly onChange = new Channel();

    private state = State.create({
        currentX: 0,
        currentY: 0,
        sourceTaskId: null,
        sourceTask: null,
        destinationTaskId: null,
        destinationTask: null,
    });

    constructor(private readonly taskRepository: TaskRepository) {
        this.onChange.fire();
    }
}
