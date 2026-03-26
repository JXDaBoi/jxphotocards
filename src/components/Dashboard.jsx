export default function Dashboard({ photocards }) {
  const total = photocards.length;
  
  const stats = photocards.reduce((acc, card) => {
    const status = card.status || 'Owned';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const groups = new Set(photocards.map(c => c.group).filter(Boolean));

  return (
    <div className="dashboard-panel glass-panel">
      <div className="stat-box">
        <h4>{total}</h4>
        <p>Total Cards</p>
      </div>
      <div className="stat-box" style={{ color: 'var(--accent)' }}>
        <h4>{stats['Owned'] || 0}</h4>
        <p>Owned</p>
      </div>
      <div className="stat-box" style={{ color: '#ec4899' }}>
        <h4>{stats['Wishlist'] || 0}</h4>
        <p>Wishlist</p>
      </div>
      <div className="stat-box" style={{ color: '#f59e0b' }}>
        <h4>{stats['On the Way'] || 0}</h4>
        <p>Incoming</p>
      </div>
      <div className="stat-box">
        <h4>{groups.size}</h4>
        <p>Unique Groups</p>
      </div>
    </div>
  );
}
