import { FC, useState } from 'react';
import { Task } from './model/Task';

export const App: FC = () => {
    return <TodoList />;
};

function TodoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;
        setTasks((oldState) => [...oldState, new Task('' + Math.random(), title)]);
        setTitle('');
    };

    return (
        <div>
            <h1>TODOリスト</h1>

            <div>
                <input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} />
                <button onClick={handleAddTaskButtonClick}>追加</button>
            </div>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
}
