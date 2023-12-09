import { AbstractRepository } from './AbstractRepository';

export class LinkRepository extends AbstractRepository<RawLink, SerializedRawLink> {
    constructor() {
        super('LinkRepository');
    }

    createAndSave(sourceTaskId: string, destinationTaskId: string): RawLink {
        const existingLink = this.findByTaskIds(sourceTaskId, destinationTaskId);
        if (existingLink !== null) return existingLink;

        const newLink = RawLink.create({ sourceTaskId, destinationTaskId });
        this.save(newLink);
        return newLink;
    }

    findByTaskIds(sourceTaskId: string, destinationTaskId: string): RawLink | null {
        return this.findById(RawLink.getId(sourceTaskId, destinationTaskId));
    }

    protected serialize(model: RawLink): SerializedRawLink {
        return {
            sourceTaskId: model.sourceTaskId,
            destinationTaskId: model.destinationTaskId,
        };
    }

    protected deserialize(serializedModel: SerializedRawLink): RawLink {
        return RawLink.create({
            sourceTaskId: serializedModel.sourceTaskId,
            destinationTaskId: serializedModel.destinationTaskId,
        });
    }

    protected getId(model: RawLink): string {
        return model.id;
    }
}

interface SerializedRawLink {
    sourceTaskId: string;
    destinationTaskId: string;
}

export class RawLink {
    protected constructor(
        public readonly sourceTaskId: string,
        public readonly destinationTaskId: string,
        // public readonly type: RelationType, // TODO
    ) {}

    get id(): string {
        return RawLink.getId(this.sourceTaskId, this.destinationTaskId);
    }

    copy(props: Partial<typeof ownProps>): RawLink {
        return Object.assign(Object.create(RawLink.prototype), { ...this, ...props });
    }

    static create(props: typeof ownProps): RawLink {
        return Object.assign(Object.create(RawLink.prototype), props);
    }

    static getId(sourceTaskId: string, destinationTaskId: string): string {
        return `${sourceTaskId}_${destinationTaskId}`;
    }
}

const ownProps = { ...RawLink.prototype };
