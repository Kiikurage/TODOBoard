import { useState } from 'react';
import { LinkDraft } from '../model/LinkDraft';
import { taskStorage } from '../deps';
import { createAndSaveNewRelationship } from '../usecase/createAndSaveNewRelationship';

export function useLinkDraft() {
    const [linkDraft, setLinkDraft] = useState(() => LinkDraft.empty());

    const startLinkDraftSession = (sourceTaskId: string) => {
        setLinkDraft(LinkDraft.start(sourceTaskId));
    };

    const finishLinkDraftSession = () => {
        try {
            const { sourceTaskId, destinationTaskId } = linkDraft;
            if (sourceTaskId === null || destinationTaskId === null || sourceTaskId === destinationTaskId) {
                return;
            }

            createAndSaveNewRelationship({ sourceTaskId, destinationTaskId });
        } finally {
            setLinkDraft(LinkDraft.empty());
        }
    };

    const setLinkDraftDestination = (taskId: string | null) => {
        setLinkDraft((oldState) => oldState.setDestination(taskId));
    };

    const tasks = taskStorage.readAll();

    const linkDraftSourceTask = linkDraft.sourceTaskId === null ? null : tasks.get(linkDraft.sourceTaskId) ?? null;
    const linkDraftDestinationTask =
        linkDraft.destinationTaskId === null ? null : tasks.get(linkDraft.destinationTaskId) ?? null;

    const isLinkDraftReady =
        linkDraftSourceTask !== null &&
        linkDraftDestinationTask !== null &&
        linkDraftSourceTask.id !== linkDraftDestinationTask.id;

    return {
        linkDraft,
        startLinkDraftSession,
        finishLinkDraftSession,
        setLinkDraftDestination,

        // TODO: これら3つ外に動かせないか
        linkDraftSourceTask,
        linkDraftDestinationTask,
        isLinkDraftReady,
    };
}
