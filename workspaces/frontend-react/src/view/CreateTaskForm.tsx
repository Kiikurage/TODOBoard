import { STYLE_CARD__ACTIVE_BORDERED } from './style/card';
import { STYLE_INPUT_FOCUSED } from './style/input';
import { CreateTaskSession } from '../controller/CreateTaskSession';
import { useDataChannel } from './hook/useDataChannel';

export function CreateTaskForm({ createTaskSession }: { createTaskSession: CreateTaskSession }) {
    const { top, left, title } = useDataChannel(createTaskSession.state);

    return (
        <div
            css={{
                ...STYLE_CARD__ACTIVE_BORDERED,
                position: 'absolute',
                top,
                left,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '10px 16px',
                width: 400,
                transition: 'transform 160ms ease-in',
            }}
        >
            <div
                css={{
                    flex: '1 1 0',
                    minWidth: 0,
                }}
            >
                <div
                    css={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                    }}
                >
                    <div
                        css={{
                            flex: '1 1 0',
                        }}
                    >
                        <span
                            css={{
                                fontSize: '0.75em',
                                color: '#666',
                                userSelect: 'text',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                css={{
                                    fontSize: '1.5em',
                                    verticalAlign: 'middle',
                                }}
                            >
                                add
                            </span>
                            新しいタスク
                        </span>
                        <div>
                            <input
                                css={{
                                    ...STYLE_INPUT_FOCUSED,
                                }}
                                type="text"
                                value={title}
                                onBlur={() => createTaskSession.submit()}
                                autoFocus
                                placeholder="タスクのタイトル"
                                onChange={(ev) => createTaskSession.setTitle(ev.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}