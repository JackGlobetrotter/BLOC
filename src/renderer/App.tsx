import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Setup from './Setup';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setup />} />
      </Routes>
    </Router>
  );
}
