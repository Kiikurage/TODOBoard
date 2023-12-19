import { singleton } from './lib/singleton';
import { BoardViewController } from './view/controller/BoardViewController';

export const boardViewController = singleton(() => new BoardViewController());
