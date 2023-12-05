import { TaskRepository } from './repository/TaskRepository';
import { LinkRepository } from './repository/LinkRepository';

export const taskStorage = new TaskRepository();
export const linkStorage = new LinkRepository();
