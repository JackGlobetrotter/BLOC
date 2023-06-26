import { createRoot } from 'react-dom/client';
import Setup from './Setup';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Setup />);
