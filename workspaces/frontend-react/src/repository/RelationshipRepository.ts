import { Relationship } from '../model/Relationship';
import { AbstractRepository } from './AbstractRepository';

export class RelationshipRepository extends AbstractRepository<Relationship, SerializedRelationship> {
    constructor() {
        super('RelationshipStorage');
    }

    protected serialize(model: Relationship): SerializedRelationship {
        return {
            sourceTaskId: model.sourceTaskId,
            destinationTaskId: model.destinationTaskId,
        };
    }

    protected deserialize(serializedModel: SerializedRelationship): Relationship {
        return Relationship.create({
            sourceTaskId: serializedModel.sourceTaskId,
            destinationTaskId: serializedModel.destinationTaskId,
        });
    }

    protected getId(model: Relationship): string {
        return model.id;
    }
}

interface SerializedRelationship {
    sourceTaskId: string;
    destinationTaskId: string;
}
