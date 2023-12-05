import { useState } from 'react';
import { LinkDraft } from '../model/LinkDraft';
import { taskStorage } from '../deps';
import { createAndSaveNewRelationship } from '../usecase/createAndSaveNewRelationship';
import { Flow, flow } from '../lib/flow/Flow';
import { Task } from '../model/Task';

export interface LinkDraftDetail {
    sourceTask: Task | null;
    destinationTask: Task | null;
    isLinkDraftReady: boolean;

    isActiveTask(taskId: string): boolean;
}

export class LinkDraftSession {
    public readonly draft = flow(LinkDraft.empty());
    public readonly detail = LinkDraftSession.getLinkDraftDetail(this.draft);

    start(sourceTaskId: string) {
        this.draft.set(LinkDraft.start(sourceTaskId));
    }

    finish() {
        try {
            const { sourceTaskId, destinationTaskId } = this.draft.get();
            if (sourceTaskId === null || destinationTaskId === null || sourceTaskId === destinationTaskId) {
                return;
            }

            createAndSaveNewRelationship({ sourceTaskId, destinationTaskId });
        } finally {
            this.draft.set(LinkDraft.empty());
        }
    }

    setDestination(taskId: string | null) {
        this.draft.set(this.draft.get().setDestination(taskId));
    }

    private static getLinkDraftDetail(linkDraftFlow: Flow<LinkDraft>): Flow<LinkDraftDetail> {
        const taskFlow = taskStorage.readAllAsFlow();

        return flow((get) => {
            const linkDraft = get(linkDraftFlow);
            const tasks = get(taskFlow);

            const sourceTask = linkDraft.sourceTaskId === null ? null : tasks.get(linkDraft.sourceTaskId) ?? null;
            const destinationTask =
                linkDraft.destinationTaskId === null ? null : tasks.get(linkDraft.destinationTaskId) ?? null;

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
}

export function useLinkDraftSession() {
    const [session] = useState(() => new LinkDraftSession());

    return session;
}
