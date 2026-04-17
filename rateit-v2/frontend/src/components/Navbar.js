import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #ede8e0', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '26px', fontFamily: "'Playfair Display', serif", color: '#e8572a', fontWeight: 700 }}>
          Rate<span style={{ color: '#2d2d2d' }}>It</span>
        </span>
        <span style={{ fontSize: '11px', color: '#999', marginTop: '4px', letterSpacing: '1px' }}>AVIS & NOTES</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/dashboard" style={{ textDecoration: 'none', fontSize: '13px', color: '#e8572a', fontWeight: 600 }}>
                Dashboard
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/add-product" className="btn-outline" style={{ textDecoration: 'none', fontSize: '13px', padding: '7px 18px' }}>
                + Ajouter
              </Link>
            )}
            <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '34px', height: '34px', background: '#fdf0e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#e8572a', fontSize: '14px' }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '14px', color: '#555' }}>
                {user.name}
                <span className={`badge badge-${user.role}`} style={{ marginLeft: '6px' }}>
                  {user.role === 'admin' ? 'Admin' : 'Membre'}
                </span>
              </span>
            </Link>
            <button onClick={logout} style={{ background: 'none', border: '1px solid #ddd', padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', color: '#666' }}>
              Deconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', fontSize: '14px', color: '#555', fontWeight: 500 }}>Connexion</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 20px' }}>S inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}
