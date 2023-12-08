import { TaskRepository } from './repository/TaskRepository';
import { LinkRepository } from './repository/LinkRepository';
import { UpdateTaskUseCase } from './usecase/UpdateTaskUseCase';
import { ReadTasksUseCase } from './usecase/ReadTasksUseCase';
import { ReadLinksUseCase } from './usecase/ReadLinksUseCase';
import { CreateAndSaveNewTaskUseCase } from './usecase/CreateAndSaveNewTaskUseCase';
import { CreateAndSaveNewLinkUseCase } from './usecase/CreateAndSaveNewLinkUseCase';
import { BoardController } from './controller/BoardController';
import { singleton } from './lib/singleton';

export const taskRepository = singleton(() => new TaskRepository());
export const linkRepository = singleton(() => new LinkRepository());

export const createAndSaveNewLink = singleton(() => CreateAndSaveNewLinkUseCase(linkRepository()));
export const createAndSaveNewTask = singleton(() => CreateAndSaveNewTaskUseCase(taskRepository()));
export const readLinks = singleton(() => ReadLinksUseCase(taskRepository(), linkRepository()));
export const readTasks = singleton(() => ReadTasksUseCase(taskRepository()));
export const updateTask = singleton(() => UpdateTaskUseCase(taskRepository()));

export const boardController = singleton(() => new BoardController());
