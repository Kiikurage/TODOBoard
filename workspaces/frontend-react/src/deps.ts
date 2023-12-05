import { TaskRepository } from './repository/TaskRepository';
import { RelationshipRepository } from './repository/RelationshipRepository';

export const taskStorage = new TaskRepository();
export const relationshipStorage = new RelationshipRepository();
