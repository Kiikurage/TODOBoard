import { dispose } from '../lib/Disposable';
import { Vector2 } from '../lib/geometry/Vector2';
import { AbstractSession } from './AbstractSession';
import { TaskRepository } from '../model/repository/TaskRepository';

export class CreateTaskSessionState {
    constructor(
        public readonly title: string,
        public readonly description: string,
        public readonly left: number,
        public readonly top: number,
    ) {}

    get readyToSubmit() {
        if (this.title.trim() === '') return false;

        return true;
    }

    copy(props: Partial<typeof CreateTaskSessionState.ownProps>): CreateTaskSessionState {
        return Object.assign(Object.create(CreateTaskSessionState.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };
}

export class CreateTaskSession extends AbstractSession<CreateTaskSessionState> {
    constructor(
        position: Vector2,
        private readonly taskRepository: TaskRepository,
    ) {
        super(
            CreateTaskSessionState.create({
                left: position.x,
                top: position.y,
                title: '',
                description: '',
            }),
        );
    }

    setTitle(title: string) {
        this.state = this.state.copy({ title });
    }

    readonly submit = () => {
        try {
            const { readyToSubmit, title, description, left, top } = this.state;
            if (!readyToSubmit) return;

            this.taskRepository.createAndSave({
                title,
                description,
                left,
                top,
            });
        } finally {
            dispose(this);
        }
    };
}
