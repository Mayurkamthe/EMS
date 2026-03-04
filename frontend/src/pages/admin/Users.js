import React, { useEffect, useState } from 'react';
import { reportsAPI, adminAPI } from '../../utils/api';

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="6" /><path d="M15 15l3 3" />
  </svg>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'faculty' });
  const [modalMsg, setModalMsg] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = () => {
    reportsAPI.getUsers().then(r => setUsers(r.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const roleStyle = {
    admin: { background: 'var(--role-admin-bg)', color: 'var(--role-admin)' },
    faculty: { background: 'var(--role-faculty-bg)', color: 'var(--role-faculty)' },
    student: { background: 'var(--role-student-bg)', color: 'var(--role-student)' },
  };

  const initials = name => name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalError(''); setModalMsg('');
    setModalLoading(true);
    try {
      await adminAPI.createUser(newUser);
      setModalMsg('User created successfully!');
      setNewUser({ name: '', email: '', password: '', role: 'faculty' });
      fetchUsers();
      setTimeout(() => { setShowModal(false); setModalMsg(''); }, 1200);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"? This action cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="page animated">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users.length} registered accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Faculty
        </button>
      </div>

      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <div className="search-icon" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', display: 'flex', pointerEvents: 'none' }}>
            <SearchIcon />
          </div>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ minWidth: 140 }}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div style={{ marginBottom: 14, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
        Showing {filtered.length} of {users.length} users
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-faint)', fontWeight: 500, width: 48 }}>{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {initials(u.name)}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                <td>
                  <span className="badge" style={roleStyle[u.role]}>{u.role}</span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td>
                  {u.role !== 'admin' && (
                    <button
                      className="btn"
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      style={{
                        background: '#fee2e2', color: '#dc2626', border: 'none',
                        padding: '5px 12px', borderRadius: 6, fontSize: 12,
                        fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <p>No users found matching your search</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Faculty Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--card-bg, #fff)', borderRadius: 16, padding: 32,
            width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: 14, right: 14, background: 'none',
              border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-muted)',
              lineHeight: 1
            }}>✕</button>

            <h2 style={{ margin: '0 0 4px', fontSize: 20, color: 'var(--text-heading)' }}>Add New User</h2>
            <p style={{ margin: '0 0 20px', color: 'var(--text-muted)', fontSize: 14 }}>Create a faculty or student account</p>

            {modalError && <div className="auth-alert auth-alert-error">{modalError}</div>}
            {modalMsg && <div className="auth-alert auth-alert-success">{modalMsg}</div>}

            <form onSubmit={handleCreateUser}>
              <div className="auth-field" style={{ marginBottom: 14 }}>
                <label>Full Name</label>
                <input
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  required placeholder="Full Name"
                />
              </div>
              <div className="auth-field" style={{ marginBottom: 14 }}>
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required placeholder="email@college.edu"
                />
              </div>
              <div className="auth-field" style={{ marginBottom: 14 }}>
                <label>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required minLength="6" placeholder="Min 6 characters"
                />
              </div>
              <div className="auth-field" style={{ marginBottom: 20 }}>
                <label>Role</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <button type="submit" className="auth-submit" disabled={modalLoading} style={{ width: '100%' }}>
                {modalLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
