import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import StarRating from '../components/StarRating';

export default function Profile() {
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchMyReviews(); }, []);

  const fetchMyReviews = async () => {
    try {
      const productsRes = await api.get('/products');
      const products    = productsRes.data;
      const allReviews  = [];
      for (const p of products) {
        const res = await api.get('/reviews/' + p._id);
        const myRevs = res.data.filter(r => r.user?._id === user?.id || r.user?.name === user?.name);
        myRevs.forEach(r => allReviews.push({ ...r, productName: p.name, productId: p._id, productImage: p.image }));
      }
      setReviews(allReviews);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 60px' }}>

      {/* Carte profil */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '36px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '80px', height: '80px', background: '#fdf0e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, color: '#e8572a', flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#2d2d2d', marginBottom: '6px' }}>
            {user?.name}
          </h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>{user?.email}</p>
          <span className={`badge badge-${user?.role}`} style={{ fontSize: '13px', padding: '4px 12px' }}>
            {user?.role === 'admin' ? 'Administrateur' : 'Membre'}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#e8572a' }}>{reviews.length}</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Avis publies</div>
        </div>
      </div>

      {/* Mes avis */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#2d2d2d', marginBottom: '20px' }}>
        Mes avis
      </h2>

      {loading ? (
        <p style={{ color: '#999', textAlign: 'center' }}>Chargement...</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', color: '#aaa' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>💬</div>
          <p style={{ marginBottom: '16px' }}>Vous n avez pas encore laisse d avis</p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            Voir les produits
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reviews.map((r, i) => (
            <Link to={'/product/' + r.productId} key={i} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <img src={r.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt={r.productName}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                  onError={e => e.target.style.display = 'none'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#2d2d2d', marginBottom: '4px' }}>{r.productName}</div>
                  <StarRating rating={r.rating} size={16} />
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '6px', lineHeight: 1.5 }}>{r.comment}</p>
                  <span style={{ fontSize: '12px', color: '#bbb' }}>
                    {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
