import { ch } from '../lib/channel/ch';
import { dispose, SymbolDispose } from '../lib/Disposable';
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

    static readonly EMPTY = CreateTaskSessionState.create({
        title: '',
        description: '',
        left: 0,
        top: 0,
    });

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

export class CreateTaskSession extends AbstractSession {
    public readonly state = ch.data(CreateTaskSessionState.EMPTY);

    constructor(
        position: Point,
        private readonly taskRepository: TaskRepository,
    ) {
        super();
        this.state.set((state) => state.copy({ left: position.x, top: position.y }));
    }

    [SymbolDispose]() {
        super[SymbolDispose]();
        dispose(this.state);
    }

    setTitle(title: string) {
        this.state.set((state) => state.copy({ title }));
    }

    readonly submit = () => {
        try {
            const { readyToSubmit, title, description, left, top } = this.state.get();
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
