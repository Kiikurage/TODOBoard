import { createRoot } from 'react-dom/client';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Editor } from './view/Editor';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root')!;

    createRoot(container).render(<App />);
});

function useEditor() {
    const editorRef = useRef<Editor | null>(null);
    if (editorRef.current === null) {
        editorRef.current = new Editor();
    }
    const editor = editorRef.current;

    useEffect(() => {
        return () => {
            editor.dispose();
            editorRef.current = null;
        };
    }, [editor]);

    const state = useSyncExternalStore(
        (callback) => {
            editor.onChange.addListener(callback);
            return () => editor.onChange.removeListener(callback);
        },
        () => editor.state,
    );

    return [editor, state] as const;
}

function App() {
    const [editor, editorState] = useEditor();

    const content = useMemo(() => {
        let value = editorState.value;
        if (editorState.focused) {
            for (const cursor of editorState.cursors) {
                value = value.slice(0, cursor.offset) + '|' + value.slice(cursor.offset);
            }
        }
        return value;
    }, [editorState]);

    return (
        <div
            css={{ position: 'fixed', inset: 0, padding: '48px', cursor: 'text' }}
            onMouseDown={(ev) => {
                ev.preventDefault();
                editor.focus();
            }}
        >
            <pre
                css={{
                    fontFamily:
                        'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Hiragino Sans GB", メイリオ, Meiryo, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
                }}
            >
                {content}
            </pre>
        </div>
    );
}
