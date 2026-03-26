export default function LightboxModal({ card, onClose }) {
  if (!card) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(15px)', zIndex: 1000, padding: '2rem' }}>
      <button className="action-btn" onClick={onClose} style={{ position: 'absolute', top: '20px', right: '30px', background: 'rgba(255,255,255,0.1)', fontSize: '1.5rem', width: '45px', height: '45px' }}>
        ✖
      </button>

      <div className="lightbox-content" onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '2rem', maxWidth: '1200px', width: '100%', maxHeight: '90vh' }}>
        
        {/* Massive Image Container */}
        <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', borderRadius: '1rem', background: '#000', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <img src={card.imageUrl} alt="" style={{ position: 'absolute', width: '120%', height: '120%', objectFit: 'cover', filter: 'blur(30px) brightness(0.4)', zIndex: 1 }} />
          <img src={card.imageUrl} alt={card.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', position: 'relative', zIndex: 2 }} />
        </div>

        {/* Info Side Panel */}
        <div className="glass-panel" style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.2rem', marginTop: 0 }}>{card.name || 'Unnamed Card'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '1px' }}>
              {(card.group || '') + ' ' + (card.member || '')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {card.status && (
              <div style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent)' }}>{card.status}</div>
              </div>
            )}
            
            {card.price && (
              <div style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Market Value</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#10b981' }}>${parseFloat(card.price).toFixed(2)}</div>
              </div>
            )}
          </div>

          {card.tags && card.tags.length > 0 && (
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Tags</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {card.tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--accent)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
