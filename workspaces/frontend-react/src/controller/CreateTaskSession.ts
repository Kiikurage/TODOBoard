import { dispose } from '../lib/Disposable';
import { Point } from '../lib/geometry/Point';
import { AbstractSession } from './AbstractSession';
import { TaskRepository } from '../repository/TaskRepository';

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

    copy(props: Partial<typeof ownProps>): CreateTaskSessionState {
        return Object.assign(Object.create(CreateTaskSessionState.prototype), this, props);
    }

    static create(props: typeof ownProps): CreateTaskSessionState {
        return CreateTaskSessionState.prototype.copy(props);
    }
}

const ownProps = { ...CreateTaskSessionState.prototype };

export class CreateTaskSession extends AbstractSession<CreateTaskSessionState> {
    constructor(
        position: Point,
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
