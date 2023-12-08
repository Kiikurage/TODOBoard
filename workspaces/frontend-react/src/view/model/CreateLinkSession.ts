import { Task } from '../../model/Task';
import { ch } from '../../lib/channel/ch';
import { taskStorage } from '../../deps';
import { createAndSaveNewLink } from '../../usecase/createAndSaveNewLink';

export class CreateLinkSessionState {
    constructor(
        public readonly isEditing: boolean,
        public readonly currentX: number,
        public readonly currentY: number,
        public readonly sourceTaskId: string | null,
        public readonly sourceTask: Task | null,
        public readonly destinationTaskId: string | null,
        public readonly destinationTask: Task | null,
    ) {}

    static readonly EMPTY = CreateLinkSessionState.create({
        isEditing: false,
        currentX: 0,
        currentY: 0,
        sourceTaskId: null,
        sourceTask: null,
        destinationTaskId: null,
        destinationTask: null,
    });

    get isLinkDraftReady() {
        if (this.sourceTask?.id === this.destinationTask?.id) return false;
        if (this.sourceTask === null || this.destinationTask === null) return false;

        return true;
    }

    isActiveTask(taskId: string): boolean {
        if (!this.isLinkDraftReady) return false;

        return this.sourceTask?.id === taskId || this.destinationTask?.id === taskId;
    }

    copy(props: Partial<typeof ownProps>): CreateLinkSessionState {
        return Object.assign(Object.create(CreateLinkSessionState.prototype), this, props);
    }

    static create(props: typeof ownProps): CreateLinkSessionState {
        return CreateLinkSessionState.prototype.copy(props);
    }
}

const ownProps = { ...CreateLinkSessionState.prototype };

export class CreateLinkSession {
    public readonly state = ch.data(CreateLinkSessionState.EMPTY);

    start(sourceTaskId: string) {
        this.state.set((oldValue) =>
            oldValue.copy({
                isEditing: true,
                sourceTaskId,
                sourceTask: taskStorage.findById(sourceTaskId),
            }),
        );
    }

    setDestinationTaskId(destinationTaskId: string | null) {
        this.state.set((oldValue) =>
            oldValue.copy({
                destinationTaskId,
                destinationTask: destinationTaskId === null ? null : taskStorage.findById(destinationTaskId),
            }),
        );
    }

    setPosition(currentX: number, currentY: number) {
        this.state.set((oldValue) => oldValue.copy({ currentX, currentY }));
    }

    finish() {
        try {
            const { sourceTaskId, destinationTaskId, isLinkDraftReady } = this.state.get();
            if (!isLinkDraftReady) return;

            createAndSaveNewLink({ sourceTaskId: sourceTaskId!, destinationTaskId: destinationTaskId! });
        } finally {
            this.state.set(CreateLinkSessionState.EMPTY);
        }
    }
}
