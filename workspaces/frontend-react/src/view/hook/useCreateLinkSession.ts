import { useState } from 'react';
import { LinkDraft } from '../../model/LinkDraft';
import { createAndSaveNewLink } from '../../usecase/createAndSaveNewLink';
import { Task } from '../../model/Task';
import { DataChannel } from '../../lib/Channel/DataChannel';
import { readTasks } from '../../usecase/readTasks';
import { ch } from '../../lib/Channel/ch';

export interface LinkDraftDetail {
    sourceTask: Task | null;
    destinationTask: Task | null;
    isLinkDraftReady: boolean;

    isActiveTask(taskId: string): boolean;
}

export class CreateLinkSession {
    public readonly draft = ch.data(LinkDraft.empty());
    public readonly detail: DataChannel<LinkDraftDetail>;

    constructor() {
        this.detail = ch.reactive((get) => {
            const draft = get(this.draft);
            const tasks = get(readTasks());

            const sourceTask = draft.sourceTaskId === null ? null : tasks.get(draft.sourceTaskId) ?? null;
            const destinationTask =
                draft.destinationTaskId === null ? null : tasks.get(draft.destinationTaskId) ?? null;

            const isLinkDraftReady =
                sourceTask !== null && destinationTask !== null && sourceTask.id !== destinationTask.id;

            const isActiveTask = (taskId: string) => {
                if (!isLinkDraftReady) return false;

                return sourceTask?.id === taskId || destinationTask?.id === taskId;
            };

            return {
                sourceTask,
                destinationTask,
                isLinkDraftReady,
                isActiveTask,
            };
        });
    }

    start(sourceTaskId: string) {
        this.draft.fire(LinkDraft.start(sourceTaskId));
    }

    finish() {
        try {
            const { sourceTaskId, destinationTaskId } = this.draft.get();
            if (sourceTaskId === null || destinationTaskId === null || sourceTaskId === destinationTaskId) {
                return;
            }

            createAndSaveNewLink({ sourceTaskId, destinationTaskId });
        } finally {
            this.draft.fire(LinkDraft.empty());
        }
    }

    setDestination(taskId: string | null) {
        this.draft.fire(this.draft.get().setDestination(taskId));
    }
}

export function useCreateLinkSession() {
    const [session] = useState(() => new CreateLinkSession());

    return session;
}
