import { createRoot } from 'react-dom/client';
import LineScreen from './LineScreen';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<LineScreen />);
