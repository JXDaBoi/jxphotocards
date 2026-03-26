import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function CollectorDirectory() {
   const [collectors, setCollectors] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
     async function fetchCollectors() {
        try {
          const q = query(collection(db, 'users'));
          const snap = await getDocs(q);
          const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          // Only show users who have initiated their profile
          setCollectors(users.filter(u => u.displayName));
        } catch (e) {
          console.error("Directory fetch failed:", e);
        }
        setLoading(false);
     }
     fetchCollectors();
     
     // Ensure default theme on directory
     document.body.className = 'dark';
   }, []);

   return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeInUp 0.8s ease' }}>
           <h1 style={{ fontSize: '3.5rem', background: 'linear-gradient(135deg, var(--text-main), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>Photocard Hub</h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Explore premium photocard collections globally.</p>
        </div>

        {loading ? (
            <div className="loading-state">Scanning Network...</div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
               {collectors.map(c => (
                  <div key={c.id} className="glass-panel" 
                       style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }} 
                       onClick={() => navigate(`/c/${c.id}`)}
                       onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                       onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                     <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>{c.displayName}</h2>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{c.bio || 'Organizing my rarities.'}</p>
                     <div style={{ marginTop: '1.5rem' }}>
                        <button className="btn-secondary" style={{ width: '100%' }}>View Collection</button>
                     </div>
                  </div>
               ))}
               {collectors.length === 0 && (
                   <div className="empty-state" style={{ gridColumn: '1/-1' }}>No collectors have registered yet.</div>
               )}
            </div>
        )}
      </div>
   );
}
