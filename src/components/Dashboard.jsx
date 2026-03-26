import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ photocards, globalSettings }) {
  const total = photocards.length;
  
  const totalValue = photocards.reduce((acc, card) => acc + (parseFloat(card.price) || 0), 0);
  
  const stats = photocards.reduce((acc, card) => {
    const status = card.status || 'Owned';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const groups = new Set(photocards.map(c => c.group).filter(Boolean));

  // Chart Setup
  const pieData = Object.entries(stats).map(([name, value]) => ({ name, value }));
  const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="dashboard-container glass-panel">
      <h3 style={{ marginBottom: '0.2rem', textAlign: 'center' }}>Analytics</h3>
      <div className="stat-box" style={{ color: 'var(--accent)' }}>
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
      {globalSettings?.valueTrackerEnabled && (
        <div className="stat-box" style={{ color: '#10b981' }}>
          <h4>${totalValue.toFixed(2)}</h4>
          <p>Est. Value</p>
        </div>
      )}
      <div className="stat-box">
        <h4>{groups.size}</h4>
        <p>Unique Groups</p>
      </div>

      {pieData.length > 0 && (
        <div className="stat-box" style={{ padding: '1.2rem 1rem 0.5rem 1rem' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Collection Breakdown</p>
          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)' }}
                  itemStyle={{ color: 'var(--accent)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
