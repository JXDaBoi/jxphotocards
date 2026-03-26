export default function FilterBar({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, groupFilter, setGroupFilter, uniqueGroups }) {
  return (
    <div className="filter-bar">
      <h3 style={{ marginBottom: '0.5rem' }}>Filters</h3>
      <div className="filter-bar-row">
        <input 
          type="text" 
          placeholder="🔍 Search card or member..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ marginBottom: 0 }}
        />
        
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field" style={{ cursor: 'pointer', marginBottom: 0 }}>
          <option value="All">All Statuses</option>
          <option value="Owned">✅ Owned</option>
          <option value="Wishlist">💖 Wishlist</option>
          <option value="On the Way">🚚 On the Way</option>
          <option value="Traded">🔄 Traded</option>
        </select>
  
        <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="input-field" style={{ cursor: 'pointer', marginBottom: 0 }}>
          <option value="All">All Groups</option>
          {uniqueGroups.map((grp) => (
            <option key={grp} value={grp}>{grp}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
