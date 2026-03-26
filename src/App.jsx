import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GalleryGrid from './components/GalleryGrid';
import AddCardModal from './components/AddCardModal';
import './index.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('photocard-theme') || 'light';
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('photocard-theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      <Navbar theme={theme} toggleTheme={setTheme} setShowAddModal={setShowAddModal} />

      <main>
        <GalleryGrid selectedTag={selectedTag} />
      </main>

      {showAddModal && <AddCardModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export default App;
