import { TaskRepository } from './repository/TaskRepository';
import { LinkRepository } from './repository/LinkRepository';
import { ReadLinksUseCase } from './usecase/ReadLinksUseCase';
import { BoardController } from './controller/BoardController';
import { singleton } from './lib/singleton';
import { ReadLinkByIdUseCase } from './usecase/ReadLinkByIdUseCase';
import { CreateLinkAndSaveUseCase } from './usecase/CreateLinkAndSaveUseCase';

export const taskRepository = singleton(() => new TaskRepository());
export const linkRepository = singleton(() => new LinkRepository());

export const createLinkAndSave = singleton(() =>
    CreateLinkAndSaveUseCase(taskRepository(), linkRepository(), readLinkById()),
);
export const readLinks = singleton(() => ReadLinksUseCase(taskRepository(), linkRepository()));
export const readLinkById = singleton(() => ReadLinkByIdUseCase(taskRepository(), linkRepository()));

export const boardController = singleton(() => new BoardController(taskRepository(), createLinkAndSave(), readLinks()));
