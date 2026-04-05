import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const { globalSettings } = useSiteSettings(currentUser?.uid);
  const [theme, setTheme] = useState(() => localStorage.getItem('photocard-theme') || 'dark');
  const location = useLocation();

  useEffect(() => {
    if (!globalSettings) return;
    const activeTheme = globalSettings.forceTheme !== 'user' ? globalSettings.forceTheme : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.body.classList.remove('showcase-active'); // Admin bypass
  }, [theme, globalSettings]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { name: 'Collection', path: '/dashboard/collection', icon: '📸' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: '📊' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="app-container dashboard-admin-view">
      <Navbar theme={theme} toggleTheme={setTheme} isForcedTheme={globalSettings?.forceTheme !== 'user'} showAdminControls={false} />
      
      <div className="layout-grid">
        <aside className="dashboard-sidebar glass-panel">
          <div className="user-profile">
            <div className="avatar">{currentUser.displayName?.charAt(0) || 'A'}</div>
            <div className="user-info">
              <h3>{currentUser.displayName || 'Admin'}</h3>
              <p className="admin-badge">Owner Profile</p>
            </div>
          </div>
          
          <nav className="dashboard-nav">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <button className="btn-secondary logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
          </div>
        </aside>
        
        <main className="dashboard-content">
          <Outlet context={{ globalSettings, theme, setTheme, currentUser }} />
        </main>
      </div>
    </div>
  );
}
