import { STYLE_CARD } from './style/card';
import { STYLE_TEXT__DESCRIPTION, STYLE_TEXT__HELPER } from './style/text';
import { BoardViewController } from './controller/BoardViewController';
import { useReactive } from './hook/useReactive';

export function SidePanel({ controller }: { controller: BoardViewController }) {
    const task = useReactive(controller.taskRepository, (repository) => [...repository.readOpenTasksAll().values()][0]);

    return (
        <div
            css={{
                ...STYLE_CARD,
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: 400,
                padding: 32,
                boxSizing: 'border-box',
                willChange: 'transform',
            }}
        >
            <p
                css={{
                    ...STYLE_TEXT__HELPER,
                    margin: 0,
                }}
            >
                <span>#{task.id}</span>
            </p>
            <h3
                css={{
                    margin: 0,
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                }}
            >
                {task.title}
            </h3>
            <div
                css={{
                    margin: 0,
                    ...STYLE_TEXT__DESCRIPTION,
                }}
            >
                {task.description}
            </div>
        </div>
    );
}
