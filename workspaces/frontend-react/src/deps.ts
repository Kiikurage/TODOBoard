import { TaskStorage } from './storage/TaskStorage';
import { RelationshipStorage } from './storage/RelationshipStorage';
import { GlobalConfigStorage } from './storage/GlobalConfigStorage';

export const taskStorage = new TaskStorage();
export const relationshipStorage = new RelationshipStorage();
export const globalConfigStorage = new GlobalConfigStorage();
