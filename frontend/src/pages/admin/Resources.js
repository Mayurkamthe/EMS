import React, { useEffect, useState } from 'react';
import { resourcesAPI } from '../../utils/api';

const defaultForm = { name: '', type: 'hall', total_quantity: 1, description: '' };

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetch = () => resourcesAPI.getAll().then(r => setResources(r.data));
  useEffect(() => { fetch(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const openAdd = () => { setForm(defaultForm); setEditId(null); setModal(true); };
  const openEdit = (r) => { setForm({ name: r.name, type: r.type, total_quantity: r.total_quantity, description: r.description }); setEditId(r.id); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await resourcesAPI.update(editId, form);
      else await resourcesAPI.create(form);
      setModal(false);
      fetch();
      flash(editId ? 'Resource updated' : 'Resource added');
    } catch { flash('Error saving resource'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    await resourcesAPI.delete(id);
    fetch();
    flash('Resource deleted');
  };

  const typeIcon = { hall: '🏛️', projector: '📽️', sound_system: '🔊', other: '📦' };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>🏛️ Manage Resources</h1>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Resource</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Quantity</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {resources.map(r => (
              <tr key={r.id}>
                <td><strong>{typeIcon[r.type] || '📦'} {r.name}</strong></td>
                <td style={{ textTransform: 'capitalize' }}>{r.type.replace('_', ' ')}</td>
                <td>{r.total_quantity}</td>
                <td>{r.description || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(r)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {resources.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: '#999' }}>No resources added yet</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editId ? 'Edit Resource' : 'Add Resource'}</h2>
              <button className="close-btn" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Resource name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="hall">Hall</option>
                    <option value="projector">Projector</option>
                    <option value="sound_system">Sound System</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" min="1" value={form.total_quantity} onChange={e => setForm({...form, total_quantity: parseInt(e.target.value)})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional description..." />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add'} Resource</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResources;
