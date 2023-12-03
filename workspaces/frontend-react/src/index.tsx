import { createRoot } from 'react-dom/client';
import { App } from './view/App';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root')!;

    createRoot(container).render(<App />);
});
