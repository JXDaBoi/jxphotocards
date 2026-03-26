import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GalleryGrid from './components/GalleryGrid';
import AddCardModal from './components/AddCardModal';
import FilterBar from './components/FilterBar';
import './index.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('photocard-theme') || 'light';
  });
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filter States
  const [showcaseMode, setShowcaseMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (showcaseMode) {
      document.body.classList.add('showcase-active');
    } else {
      document.body.classList.remove('showcase-active');
    }
    localStorage.setItem('photocard-theme', theme);
  }, [theme, showcaseMode]);

  return (
    <div className="app-container">
      <Navbar theme={theme} toggleTheme={setTheme} setShowAddModal={setShowAddModal} />

      <main>
        <GalleryGrid 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          groupFilter={groupFilter}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          setGroupFilter={setGroupFilter}
          showcaseMode={showcaseMode}
          setShowcaseMode={setShowcaseMode}
        />
      </main>

      {showAddModal && <AddCardModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export default App;
