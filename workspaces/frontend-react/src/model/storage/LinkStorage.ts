import { Link } from '../Link';
import { TaskRepository } from '../repository/TaskRepository';
import { RawLinkRepository } from '../repository/RawLinkRepository';
import { throwError } from '../../lib/throwError';
import { Channel } from '../../lib/Channel';

export class LinkStorage {
    public readonly onChange = new Channel();

    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly rawLinkRepository: RawLinkRepository,
    ) {
        this.taskRepository.onChange.addListener(() => this.onChange.fire());
        this.rawLinkRepository.onChange.addListener(() => this.onChange.fire());
    }

    readAll(): ReadonlyMap<string, Link> {
        const tasks = this.taskRepository.readAll();
        const rawLinks = this.rawLinkRepository.readAll();

        const map = new Map<string, Link>();

        for (const rawLink of rawLinks.values()) {
            const sourceTask = tasks.get(rawLink.sourceTaskId);
            const destinationTask = tasks.get(rawLink.destinationTaskId);
            if (sourceTask === undefined || destinationTask === undefined) {
                console.error(`rawLink is corrupted. rawLink: ${JSON.stringify(rawLink)}`);
                continue;
            }

            if (sourceTask.completed || destinationTask.completed) continue;

            const link = Link.create({ sourceTask, destinationTask });
            map.set(link.id, link);
        }

        return map;
    }

    createAndSave(props: CreateLinkProps): Link {
        const { sourceTaskId, destinationTaskId } = props;
        if (sourceTaskId === destinationTaskId) throwError(`Source task and destination task are the same`);
        this.taskRepository.findById(sourceTaskId) ?? throwError(`Task #${sourceTaskId} is not found`);
        this.taskRepository.findById(destinationTaskId) ?? throwError(`Task #${destinationTaskId} is not found`);

        this.rawLinkRepository.createAndSave(sourceTaskId, destinationTaskId);
        const link = this.findByTaskIds(sourceTaskId, destinationTaskId);
        if (link === null) throwError('Failed to create link');

        return link;
    }

    findByTaskIds(sourceTaskId: string, destinationTaskId: string): Link | null {
        const rawLink = this.rawLinkRepository.findByTaskIds(sourceTaskId, destinationTaskId);
        if (rawLink === null) return null;

        const sourceTask = this.taskRepository.findById(sourceTaskId);
        const destinationTask = this.taskRepository.findById(destinationTaskId);
        if (sourceTask === null || destinationTask === null) {
            console.error(`rawLink is corrupted. rawLink: ${JSON.stringify(rawLink)}`);
            return null;
        }

        if (sourceTask.completed || destinationTask.completed) return null;

        return Link.create({ sourceTask, destinationTask });
    }
}

interface CreateLinkProps {
    sourceTaskId: string;
    destinationTaskId: string;
}
