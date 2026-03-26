import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PublicView from './pages/PublicView';
import AdminView from './pages/AdminView';
import { useSiteSettings } from './hooks/useSiteSettings';
import './index.css';

function App() {
  const { settings, loading } = useSiteSettings();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('photocard-theme') || 'light');

  useEffect(() => {
    if (loading) return;

    const activeTheme = settings.forceTheme !== 'user' ? settings.forceTheme : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    // Check if we are physically rendering the admin page
    const isAdminRoute = location.pathname.includes('/admin');
    
    // The Showcase restriction shouldn't completely lock out the Admin Page
    if (settings.showcaseMode && !isAdminRoute) {
      document.body.classList.add('showcase-active');
    } else {
      document.body.classList.remove('showcase-active');
    }
    
    if (settings.forceTheme === 'user') {
      localStorage.setItem('photocard-theme', activeTheme);
    }
  }, [theme, settings.showcaseMode, settings.forceTheme, loading, location.pathname]);

  if (loading) return null; // Avoid render flash

  return (
    <Routes>
      <Route path="/" element={<PublicView theme={theme} setTheme={setTheme} settings={settings} />} />
      <Route path="/admin" element={<AdminView theme={theme} setTheme={setTheme} settings={settings} />} />
    </Routes>
  );
}

export default App;
