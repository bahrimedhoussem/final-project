import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Vérifier que les mots de passe correspondent
    if (password !== confirm) {
      return setError('Les mots de passe ne correspondent pas');
    }

    setLoading(true);
    try {
      // Le rôle n'est pas envoyé → le backend met 'user' par défaut
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de l'inscription");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', color: '#2d2d2d' }}>
            Créer un compte
          </h1>
          <p style={{ color: '#999', marginTop: '8px', fontSize: '14px' }}>
            Rejoignez la communauté RateIt
          </p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Nom complet
            </label>
            <input
              className="input" type="text" value={name}
              onChange={e => setName(e.target.value)}
              required placeholder="Votre nom"
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              className="input" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required placeholder="votre@email.com"
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Mot de passe
            </label>
            <input
              className="input" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              required minLength={6} placeholder="Minimum 6 caractères"
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Confirmer le mot de passe
            </label>
            <input
              className="input" type="password" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required placeholder="Répétez le mot de passe"
              style={{ borderColor: confirm && confirm !== password ? '#e74c3c' : '' }}
            />
            {confirm && confirm !== password && (
              <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>

          {/* Info rôle */}
          <div style={{ background: '#fdf8f3', border: '1px solid #e0d0c0', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#a05c20' }}>
            Tous les nouveaux comptes sont créés en tant que <strong>Membre</strong>. 
            Contactez un administrateur pour obtenir des droits supplémentaires.
          </div>

          <button
            type="submit" className="btn-primary" disabled={loading}
            style={{ marginTop: '4px', width: '100%', padding: '13px' }}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#888', fontSize: '14px' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#e8572a', fontWeight: 600, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
