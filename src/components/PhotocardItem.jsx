export default function PhotocardItem({ card, onDelete, onEdit, globalSettings }) {
  const statusColors = {
    'Owned': 'var(--accent)',
    'Wishlist': '#ec4899',
    'On the Way': '#f59e0b',
    'Traded': '#64748b'
  };

  const statusColor = statusColors[card.status || 'Owned'];

  const handleTrade = (e) => {
    e.stopPropagation();
    const text = `Hi! I saw your Photocard Database. I am interested in trading for your ${card.name} (${card.group || ''} ${card.member || ''}). Let's talk!`;
    navigator.clipboard.writeText(text);
    alert('✅ Trade request format copied to your clipboard!');
  };

  return (
    <div className="photocard-item glass-panel">
      <div className="image-wrapper">
        <img src={card.imageUrl} alt="" className="blur-bg" loading="lazy" />
        <img src={card.imageUrl} alt={card.name} className="main-img" loading="lazy" />
        <div className="card-actions">
            {globalSettings?.tradeGeneratorEnabled && (card.status === 'Traded' || card.status === 'Wishlist' || card.status === 'Owned') && (
              <button className="action-btn trade-btn" onClick={handleTrade} title="Propose Trade">🤝</button>
            )}
            {onEdit && (
              <button className="action-btn edit-btn" onClick={onEdit} title="Edit Card">✏️</button>
            )}
            {onDelete && (
              <button className="action-btn delete-btn" onClick={onDelete} title="Delete Card">❌</button>
            )}
        </div>
      </div>
      <div className="photocard-details" style={{ position: 'relative' }}>
        <span className="status-badge" style={{ backgroundColor: statusColor }}>{card.status || 'Owned'}</span>
        <h3>{card.name}</h3>
        {card.group && <p className="card-group">{card.group}</p>}
        {card.member && <p className="card-member">{card.member}</p>}
        
        <div className="tags-container">
          {card.tags?.map((tag, idx) => (
            <span key={idx} className="tag-badge">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
