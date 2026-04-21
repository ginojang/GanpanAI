import { Route, Routes } from 'react-router-dom';
import WikiPage from './pages/WikiPage';

export default function App() {
  return (
    <Routes>
      <Route path="/wiki" element={<WikiPage />} />
      <Route path="/wiki/*" element={<WikiPage />} />
    </Routes>
  );
}