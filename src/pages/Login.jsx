import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Successfully authenticated.', 'success');
      navigate('/dashboard/collection');
    } catch (err) {
      addToast(err.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel slide-in">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter your credentials to access your dashboard.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="input-field" 
              style={{ marginBottom: 0 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="input-field" 
              style={{ marginBottom: 0 }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Directory</Link>
        </div>
      </div>
    </div>
  );
}
