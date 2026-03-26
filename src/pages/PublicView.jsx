import { useState } from 'react';
import Navbar from '../components/Navbar';
import GalleryGrid from '../components/GalleryGrid';

export default function PublicView({ theme, setTheme, settings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  return (
    <div className="app-container">
      <Navbar theme={theme} toggleTheme={setTheme} isForcedTheme={settings.forceTheme !== 'user'} showAdminControls={false} />
      <main>
        <GalleryGrid 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          groupFilter={groupFilter}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          setGroupFilter={setGroupFilter}
          globalSettings={settings}
          isAdminView={false}
        />
      </main>
    </div>
  );
}
