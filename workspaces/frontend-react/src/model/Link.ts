export class Link {
    protected constructor(
        public readonly sourceTaskId: string,
        public readonly destinationTaskId: string,
        // public readonly type: RelationType, // TODO
    ) {}

    get id(): string {
        return Link.getId(this.sourceTaskId, this.destinationTaskId);
    }

    copy(props: Partial<typeof ownProps>): Link {
        return Object.assign(Object.create(Link.prototype), { ...this, ...props });
    }

    equalTo(other: Link): boolean {
        return (Object.keys({ ...this }) as (keyof Link)[]).every((key) => this[key] === other[key]);
    }

    static create(props: typeof ownProps): Link {
        return Object.assign(Object.create(Link.prototype), props);
    }

    static getId(sourceTaskId: string, destinationTaskId: string): string {
        return `${sourceTaskId}_${destinationTaskId}`;
    }
}

const ownProps = { ...Link.prototype };
