import { TaskRepository } from './model/repository/TaskRepository';
import { RawLinkRepository } from './model/repository/RawLinkRepository';
import { BoardController } from './controller/BoardController';
import { singleton } from './lib/singleton';
import { LinkRepository } from './model/repository/LinkRepository';
import { BoardViewController } from './view/controller/BoardViewController';

export const taskRepository = singleton(() => new TaskRepository());
export const rawLinkRepository = singleton(() => new RawLinkRepository());

export const linkRepository = singleton(() => new LinkRepository(taskRepository(), rawLinkRepository()));

export const boardController = singleton(() => new BoardController(taskRepository(), linkRepository()));

export const boardViewController = singleton(() => new BoardViewController(boardController()));
