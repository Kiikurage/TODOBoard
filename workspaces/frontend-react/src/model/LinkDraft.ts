export class LinkDraft {
    protected constructor(
        public readonly status: 'SLEEP' | 'DRAFTING' | 'FINALIZED',
        public readonly sourceTaskId: string | null,
        public readonly destinationTaskId: string | null,
    ) {}

    static empty() {
        return LinkDraft.create({
            status: 'SLEEP',
            sourceTaskId: null,
            destinationTaskId: null,
        });
    }

    static start(sourceTaskId: string) {
        return LinkDraft.create({
            status: 'DRAFTING',
            sourceTaskId,
            destinationTaskId: null,
        });
    }

    setDestination(taskId: string | null) {
        if (this.status !== 'DRAFTING') return this;

        return this.copy({ destinationTaskId: taskId });
    }

    copy(props: Partial<typeof ownProps>): LinkDraft {
        return Object.assign(Object.create(LinkDraft.prototype), { ...this, ...props });
    }

    equalTo(other: LinkDraft): boolean {
        return (Object.keys({ ...this }) as (keyof LinkDraft)[]).every((key) => this[key] === other[key]);
    }

    static create(props: typeof ownProps): LinkDraft {
        return Object.assign(Object.create(LinkDraft.prototype), props);
    }
}

const ownProps = { ...LinkDraft.prototype };
