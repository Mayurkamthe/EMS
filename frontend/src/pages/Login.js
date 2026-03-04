import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AlertCircle = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8"/><path d="M10 6v4"/><circle cx="10" cy="14" r="0.8" fill="currentColor"/>
  </svg>
);

const EmsLogo = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="white" opacity="0.15"/>
    <path d="M7 8h10M7 12h7M7 16h5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="18" cy="6" r="2.5" fill="white" opacity="0.9"/>
    <path d="M17.3 6h1.4M18 5.3v1.4" stroke="#1B3A6B" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      navigate(role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animated">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <EmsLogo />
          </div>
          <div>
            <div className="auth-title">College EMS</div>
            <div className="auth-subtitle">Event Management System</div>
          </div>
        </div>

        <h2 className="auth-heading">Sign in</h2>
        <p className="auth-subheading">Enter your credentials to access your account</p>

        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@college.edu"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          No account yet? <Link to="/register" className="auth-link">Create one</Link>
        </p>

        <div className="auth-demo">
          <strong>Demo credentials</strong><br />
          Admin: admin@college.edu / password
        </div>
      </div>
    </div>
  );
};

export default Login;
