import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GalleryGrid from './components/GalleryGrid';
import AddCardModal from './components/AddCardModal';
import { useSiteSettings } from './hooks/useSiteSettings';
import './index.css';

function App() {
  const { settings, loading } = useSiteSettings();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('photocard-theme') || 'light';
  });
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  useEffect(() => {
    if (loading) return;

    const activeTheme = settings.forceTheme !== 'user' ? settings.forceTheme : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    if (settings.showcaseMode) {
      document.body.classList.add('showcase-active');
    } else {
      document.body.classList.remove('showcase-active');
    }
    
    if (settings.forceTheme === 'user') {
      localStorage.setItem('photocard-theme', activeTheme);
    }
  }, [theme, settings.showcaseMode, settings.forceTheme, loading]);

  if (loading) return null; // Avoid render flash

  return (
    <div className="app-container">
      <Navbar 
        theme={theme} 
        toggleTheme={setTheme} 
        setShowAddModal={setShowAddModal} 
        isForcedTheme={settings.forceTheme !== 'user'} 
      />

      <main>
        <GalleryGrid 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          groupFilter={groupFilter}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          setGroupFilter={setGroupFilter}
          globalSettings={settings}
        />
      </main>

      {showAddModal && <AddCardModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export default App;
