import { FC } from 'react';
import { BoardView } from './BoardView';
import { boardViewController } from '../deps';

export const App: FC = () => {
    return <BoardView controller={boardViewController()} />;
};
