import { Link } from '../model/Link';
import { AbstractRepository } from './AbstractRepository';

export class LinkRepository extends AbstractRepository<Link, SerializedLink> {
    constructor() {
        super('LinkRepository');
    }

    protected serialize(model: Link): SerializedLink {
        return {
            sourceTaskId: model.sourceTaskId,
            destinationTaskId: model.destinationTaskId,
        };
    }

    protected deserialize(serializedModel: SerializedLink): Link {
        return Link.create({
            sourceTaskId: serializedModel.sourceTaskId,
            destinationTaskId: serializedModel.destinationTaskId,
        });
    }

    protected getId(model: Link): string {
        return model.id;
    }
}

interface SerializedLink {
    sourceTaskId: string;
    destinationTaskId: string;
}
