import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const labels = ['', 'Mauvais 😞', 'Moyen 😐', 'Bien 🙂', 'Très bien 😊', 'Excellent 🤩'];
  const fallback = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/${id}`),
      ]);
      setProduct(pRes.data);
      setReviews(rRes.data);
    } catch {
      console.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!rating) return setError('Veuillez choisir une note');
    try {
      const res = await api.post(`/reviews/${id}`, { rating, comment });
      setReviews([res.data, ...reviews]);
      setProduct(prev => {
        const total = reviews.length + 1;
        const avg = ((reviews.reduce((s,r) => s + r.rating, 0) + rating) / total).toFixed(1);
        return { ...prev, avgRating: Number(avg), reviewCount: total };
      });
      setRating(0); setComment('');
      setSuccess('✅ Votre avis a été publié !');
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de l\'envoi');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>⏳ Chargement…</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px', color: '#e74c3c' }}>Produit introuvable.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 60px' }}>
      <Link to="/" style={{ color: '#e8572a', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
        ← Retour au catalogue
      </Link>

      {/* ── Fiche produit ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <img
          src={product.image || fallback}
          alt={product.name}
          style={{ width: '100%', height: '340px', objectFit: 'cover' }}
          onError={e => { e.target.src = fallback; }}
        />
        <div style={{ padding: '32px 32px 32px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="badge badge-cat">{product.category}</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#2d2d2d', lineHeight: 1.3 }}>
            {product.name}
          </h1>
          <p style={{ color: '#777', lineHeight: 1.7, fontSize: '15px' }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StarRating rating={Math.round(product.avgRating)} size={24} />
            <span style={{ color: '#555', fontSize: '15px' }}>
              {product.avgRating > 0 ? `${product.avgRating}/5 — ${product.reviewCount} avis` : 'Aucun avis'}
            </span>
          </div>

          <div style={{ fontSize: '34px', fontWeight: 700, color: '#e8572a', marginTop: '8px' }}>
            {product.price.toFixed(2)} €
          </div>

          {/* Barre de note visuelle */}
          {product.avgRating > 0 && (
            <div style={{ background: '#fdf0e6', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a05c20', marginBottom: '6px' }}>
                <span>Note globale</span><span>{product.avgRating}/5</span>
              </div>
              <div style={{ background: '#f0d5b0', borderRadius: '4px', height: '6px' }}>
                <div style={{ background: '#e8a020', height: '6px', borderRadius: '4px', width: `${(product.avgRating / 5) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

        {/* ── Formulaire avis ── */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '20px', color: '#2d2d2d' }}>
            ✍️ Laisser un avis
          </h2>

          {!user ? (
            <div style={{ textAlign: 'center', padding: '20px', background: '#fdf0e6', borderRadius: '10px' }}>
              <p style={{ color: '#a05c20', marginBottom: '14px', fontSize: '14px' }}>
                Connectez-vous pour donner votre avis
              </p>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', fontSize: '14px' }}>
                Se connecter
              </Link>
            </div>
          ) : (
            <>
              {error   && <div className="alert-error">{error}</div>}
              {success && <div className="alert-success">{success}</div>}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>Votre note</label>
                  <StarRating rating={rating} onSelect={setRating} size={32} />
                  {rating > 0 && <span style={{ fontSize: '13px', color: '#e8a020', marginLeft: '8px' }}>{labels[rating]}</span>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>Votre commentaire</label>
                  <textarea
                    className="input"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required rows={4}
                    placeholder="Partagez votre expérience…"
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Publier mon avis
                </button>
              </form>
            </>
          )}
        </div>

        {/* ── Liste des avis ── */}
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', marginBottom: '20px', color: '#2d2d2d' }}>
            💬 Avis ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', color: '#aaa' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
              <p>Soyez le premier à noter ce produit !</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reviews.map(r => (
                <div key={r._id} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', background: '#fdf0e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#e8572a', fontSize: '15px' }}>
                        {r.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{r.user?.name || 'Utilisateur'}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#bbb' }}>
                      {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <StarRating rating={r.rating} size={16} />
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6, marginTop: '8px' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
