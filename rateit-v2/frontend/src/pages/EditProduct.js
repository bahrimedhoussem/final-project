import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['Electronique', 'Chaussures', 'Mode', 'Maison', 'Livres', 'Sport', 'Beaute', 'Alimentation', 'Autre'];

export default function EditProduct() {
  const { id } = useParams();
  const [form,    setForm]    = useState({ name: '', description: '', price: '', category: '', image: '' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cats,    setCats]    = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get('/products/' + id);
        const p = res.data;
        setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image || '' });
      } catch { setError('Produit introuvable'); }
    };
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCats(res.data.map(c => c.name));
      } catch { setCats(CATEGORIES); }
    };
    fetchProduct();
    fetchCats();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.put('/products/' + id, { ...form, price: Number(form.price) });
      setSuccess('Produit modifie avec succes !');
      setTimeout(() => navigate('/'), 1500);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la modification');
    } finally { setLoading(false); }
  };

  const allCats = cats.length > 0 ? cats : CATEGORIES;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px 60px' }}>
      <Link to="/" style={{ color: '#e8572a', textDecoration: 'none', fontSize: '14px' }}>Retour</Link>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginTop: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#2d2d2d', marginBottom: '24px' }}>
          Modifier le produit
        </h1>

        {error   && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>Nom du produit</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea className="input" name="description" value={form.description} onChange={handleChange} required rows={4} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>Prix (euro)</label>
              <input className="input" name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>Categorie</label>
              <select className="input" name="category" value={form.category} onChange={handleChange} required>
                <option value="">-- Choisir --</option>
                {allCats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>URL image</label>
            <input className="input" name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
            {form.image && (
              <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', height: '140px' }}>
                <img src={form.image} alt="Apercu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px', fontSize: '16px' }}>
            {loading ? 'Modification...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
