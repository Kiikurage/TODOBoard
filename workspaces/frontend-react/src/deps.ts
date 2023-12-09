import { TaskRepository } from './model/repository/TaskRepository';
import { RawLinkRepository } from './model/repository/RawLinkRepository';
import { BoardController } from './controller/BoardController';
import { singleton } from './lib/singleton';
import { LinkStorage } from './model/storage/LinkStorage';

export const taskRepository = singleton(() => new TaskRepository());
export const rawLinkRepository = singleton(() => new RawLinkRepository());

export const linkStorage = singleton(() => new LinkStorage(taskRepository(), rawLinkRepository()));

export const boardController = singleton(() => new BoardController(taskRepository(), linkStorage()));
