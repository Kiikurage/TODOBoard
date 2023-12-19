import { Link } from '../Link';
import { TaskRepository } from './TaskRepository';
import { RawLinkRepository } from './RawLinkRepository';
import { throwError } from '../../lib/throwError';
import { Channel } from '../../lib/Channel';

export class LinkRepository {
    public readonly onChange = new Channel();

    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly rawLinkRepository: RawLinkRepository,
    ) {
        this.taskRepository.onChange.addListener(() => this.onChange.fire());
        this.rawLinkRepository.onChange.addListener(() => this.onChange.fire());
    }

    findById(id: string): Link | null {
        const rawLink = this.rawLinkRepository.findById(id);
        if (rawLink === null) return null;

        const sourceTask = this.taskRepository.findById(rawLink.sourceTaskId);
        const destinationTask = this.taskRepository.findById(rawLink.destinationTaskId);
        if (sourceTask === null || destinationTask === null) {
            console.error(`rawLink is corrupted. rawLink: ${JSON.stringify(rawLink)}`);
            return null;
        }

        if (sourceTask.completed || destinationTask.completed) return null;

        return Link.create({ sourceTask, destinationTask });
    }

    findByTaskIds(sourceTaskId: string, destinationTaskId: string): Link | null {
        return this.findById(Link.getId(sourceTaskId, destinationTaskId));
    }

    save(model: Link): void {
        const { sourceTask, destinationTask } = model;
        this.createAndSave({ sourceTaskId: sourceTask.id, destinationTaskId: destinationTask.id });
    }

    deleteById(id: string): void {
        this.rawLinkRepository.deleteById(id);
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

    createAndSave(props: CreateLinkProps) {
        const { sourceTaskId, destinationTaskId } = props;
        if (sourceTaskId === destinationTaskId) throwError(`Source task and destination task are the same`);
        this.taskRepository.findById(sourceTaskId) ?? throwError(`Task #${sourceTaskId} is not found`);
        this.taskRepository.findById(destinationTaskId) ?? throwError(`Task #${destinationTaskId} is not found`);

        this.rawLinkRepository.createAndSave(sourceTaskId, destinationTaskId);
        const link = this.findByTaskIds(sourceTaskId, destinationTaskId);
        if (link === null) throwError('Failed to create link');

        return link;
    }
}

interface CreateLinkProps {
    sourceTaskId: string;
    destinationTaskId: string;
}
