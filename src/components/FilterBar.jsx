export default function FilterBar({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, groupFilter, setGroupFilter, uniqueGroups }) {
  return (
    <div className="filter-bar glass-panel">
      <input 
        type="text" 
        placeholder="🔍 Search cards by name or member..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-field search-input"
        style={{ flex: '1 1 auto', marginBottom: '0' }}
      />
      
      <div className="filter-dropdowns">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field select-filter">
          <option value="All">All Statuses</option>
          <option value="Owned">✅ Owned</option>
          <option value="Wishlist">💖 Wishlist</option>
          <option value="On the Way">🚚 On the Way</option>
          <option value="Traded">🔄 Traded</option>
        </select>
        
        <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="input-field select-filter">
          <option value="All">All Groups</option>
          {uniqueGroups.map((grp) => (
            <option key={grp} value={grp}>{grp}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
