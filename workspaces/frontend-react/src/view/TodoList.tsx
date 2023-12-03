import { useState } from 'react';
import { Task } from '../model/Task';
import { useSaveTask, useTasks } from './useTasks';
import { TodoListItem } from './TodoListItem';

export function TodoList() {
    const tasks = useTasks();
    const saveTask = useSaveTask();

    const [title, setTitle] = useState('');

    const handleAddTaskButtonClick = () => {
        if (title.trim() === '') return;
        saveTask(
            Task.create({
                id: '' + Math.random(),
                title,
                completed: false,
                description: '',
            }),
        );
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
                {[...tasks.values()].map((task) => (
                    <TodoListItem task={task} key={task.id}></TodoListItem>
                ))}
            </ul>
        </div>
    );
}
