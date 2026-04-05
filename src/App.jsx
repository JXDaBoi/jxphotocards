import { Routes, Route, Navigate } from 'react-router-dom';
import CollectorDirectory from './pages/CollectorDirectory';
import CollectionLoader from './components/CollectionLoader';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import CollectionManager from './pages/CollectionManager';
import AnalyticsView from './pages/AnalyticsView';
import SettingsView from './pages/SettingsView';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CollectorDirectory />} />
      <Route path="/c/:adminId" element={<CollectionLoader />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Dashboard Layout */}
      <Route path="/dashboard" element={<AdminLayout />}>
        {/* Redirect /dashboard to /dashboard/collection */}
        <Route index element={<Navigate to="collection" replace />} />
        <Route path="collection" element={<CollectionManager />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
