import { Task } from './Task';
import { RawLink } from '../repository/LinkRepository';

export class Link {
    protected constructor(
        public readonly sourceTask: Task,
        public readonly destinationTask: Task,
        // public readonly type: RelationType, // TODO
    ) {}

    get id(): string {
        return Link.getId(this.sourceTask.id, this.destinationTask.id);
    }

    copy(props: Partial<typeof ownProps>): Link {
        return Object.assign(Object.create(Link.prototype), { ...this, ...props });
    }

    static create(props: typeof ownProps): Link {
        return Object.assign(Object.create(Link.prototype), props);
    }

    static getId(sourceTaskId: string, destinationTaskId: string): string {
        return RawLink.getId(sourceTaskId, destinationTaskId);
    }
}

const ownProps = { ...Link.prototype };
