import { Routes, Route } from 'react-router-dom';
import CollectorDirectory from './pages/CollectorDirectory';
import CollectionLoader from './components/CollectionLoader';
import AdminView from './pages/AdminView';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CollectorDirectory />} />
      <Route path="/c/:adminId" element={<CollectionLoader />} />
      <Route path="/admin" element={<AdminView />} />
    </Routes>
  );
}

export default App;
