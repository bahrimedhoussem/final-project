import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [stats,      setStats]      = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCat,     setNewCat]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [catError,   setCatError]   = useState('');
  const [catSuccess, setCatSuccess] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, catsRes] = await Promise.all([
        api.get('/products/stats'),
        api.get('/categories'),
      ]);
      setStats(statsRes.data);
      setCategories(catsRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddCat = async (e) => {
    e.preventDefault();
    setCatError(''); setCatSuccess('');
    try {
      const res = await api.post('/categories', { name: newCat });
      setCategories([...categories, res.data]);
      setNewCat('');
      setCatSuccess('Categorie ajoutee !');
      setTimeout(() => setCatSuccess(''), 2000);
    } catch (e) { setCatError(e.response?.data?.message || 'Erreur'); }
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm('Supprimer cette categorie ?')) return;
    try {
      await api.delete('/categories/' + id);
      setCategories(categories.filter(c => c._id !== id));
    } catch { alert('Erreur suppression'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Chargement...</div>;

  const statCards = [
    { label: 'Produits', value: stats?.totalProducts || 0, icon: '📦', color: '#fdf0e6', border: '#e8a020' },
    { label: 'Avis total', value: stats?.totalReviews || 0, icon: '💬', color: '#eaf3fb', border: '#2980b9' },
    { label: 'Note moyenne', value: stats?.avgRating ? stats.avgRating + '/5' : 'N/A', icon: '⭐', color: '#eafaf1', border: '#27ae60' },
    { label: 'Categories', value: categories.length, icon: '🏷️', color: '#fbeaf0', border: '#e8572a' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#2d2d2d' }}>
          Dashboard Admin
        </h1>
        <Link to="/add-product" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Ajouter un produit
        </Link>
      </div>

      {/* Cartes statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: s.color, border: '1px solid ' + s.border, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2d2d2d' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>

        {/* Top produits */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '18px', color: '#2d2d2d' }}>
            Top 3 produits les mieux notes
          </h2>
          {stats?.topProducts?.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '14px' }}>Pas encore d avis</p>
          ) : (
            stats?.topProducts?.map((p, i) => (
              <Link to={'/product/' + p._id} key={p._id} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', marginBottom: '8px', background: '#fdf8f3', transition: 'background 0.2s', cursor: 'pointer' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#e8572a', width: '28px' }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#2d2d2d' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{p.reviewCount} avis</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#e8a020', fontSize: '15px' }}>★ {p.avgRating}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Produits par catégorie */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '18px', color: '#2d2d2d' }}>
            Produits par categorie
          </h2>
          {stats?.byCategory?.map(c => (
            <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0ebe5' }}>
              <span style={{ fontSize: '14px', color: '#555' }}>{c._id}</span>
              <span style={{ background: '#fdf0e6', color: '#e8572a', fontWeight: 700, fontSize: '13px', padding: '2px 10px', borderRadius: '20px' }}>
                {c.count} produit{c.count > 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Gestion catégories */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '18px', color: '#2d2d2d' }}>
            Gestion des categories
          </h2>

          {/* Ajouter une catégorie */}
          <form onSubmit={handleAddCat} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input className="input" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nom de la nouvelle categorie" required style={{ flex: 1 }} />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '10px 24px' }}>
              + Ajouter
            </button>
          </form>
          {catError   && <div className="alert-error">{catError}</div>}
          {catSuccess && <div className="alert-success">{catSuccess}</div>}

          {/* Liste des catégories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categories.map(c => (
              <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fdf0e6', border: '1px solid #f0d5b0', borderRadius: '20px', padding: '6px 14px' }}>
                <span style={{ fontSize: '14px', color: '#a05c20', fontWeight: 500 }}>{c.name}</span>
                <button onClick={() => handleDeleteCat(c._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e8572a', fontSize: '16px', lineHeight: 1, padding: 0 }}>
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
