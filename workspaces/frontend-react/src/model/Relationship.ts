export class Relationship {
    protected constructor(
        public readonly id: string,
        public readonly sourceTaskId: string,
        public readonly destinationTaskId: string,
        // public readonly type: RelationType, // TODO
    ) {}

    copy(props: Partial<typeof ownProps>): Relationship {
        return Object.assign(Object.create(Relationship.prototype), { ...this, ...props });
    }

    static create(props: typeof ownProps): Relationship {
        return Object.assign(Object.create(Relationship.prototype), props);
    }
}

const ownProps = { ...Relationship.prototype };
