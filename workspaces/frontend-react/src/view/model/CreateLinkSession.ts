import { Task } from '../../model/Task';
import { ch } from '../../lib/Channel/ch';
import { taskStorage } from '../../deps';
import { createAndSaveNewLink } from '../../usecase/createAndSaveNewLink';

class State {
    constructor(
        public readonly isEditing: boolean,
        public readonly currentX: number,
        public readonly currentY: number,
        public readonly sourceTaskId: string | null,
        public readonly sourceTask: Task | null,
        public readonly destinationTaskId: string | null,
        public readonly destinationTask: Task | null,
    ) {}

    static readonly EMPTY = State.create({
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

    copy(props: Partial<typeof ownProps>): State {
        return Object.assign(Object.create(State.prototype), this, props);
    }

    static create(props: typeof ownProps): State {
        return State.prototype.copy(props);
    }
}

const ownProps = { ...State.prototype };

export class CreateLinkSession {
    public readonly state = ch.data(State.EMPTY);

    setSourceTaskId(sourceTaskId: string) {
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
            this.state.set(State.EMPTY);
        }
    }
}
