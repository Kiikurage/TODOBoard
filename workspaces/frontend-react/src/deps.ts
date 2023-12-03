import { TaskRepository } from './repository/TaskRepository';
import { RelationshipRepository } from './repository/RelationshipRepository';
import { GlobalConfigRepository } from './repository/GlobalConfigRepository';

export const taskStorage = new TaskRepository();
export const relationshipStorage = new RelationshipRepository();
export const globalConfigStorage = new GlobalConfigRepository();
