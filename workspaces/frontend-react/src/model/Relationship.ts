export class Relationship {
    protected constructor(
        public readonly sourceTaskId: string,
        public readonly destinationTaskId: string,
        // public readonly type: RelationType, // TODO
    ) {}

    get id(): string {
        return Relationship.getId(this.sourceTaskId, this.destinationTaskId);
    }

    copy(props: Partial<typeof ownProps>): Relationship {
        return Object.assign(Object.create(Relationship.prototype), { ...this, ...props });
    }

    equalTo(other: Relationship): boolean {
        return (Object.keys({ ...this }) as (keyof Relationship)[]).every((key) => this[key] === other[key]);
    }

    static create(props: typeof ownProps): Relationship {
        return Object.assign(Object.create(Relationship.prototype), props);
    }

    static getId(sourceTaskId: string, destinationTaskId: string): string {
        return `${sourceTaskId}_${destinationTaskId}`;
    }
}

const ownProps = { ...Relationship.prototype };
