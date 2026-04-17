import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProductCard({ product, onDelete, isAdmin }) {
  const fallback = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img src={product.image || fallback} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = fallback; }} />
        <span className="badge badge-cat" style={{ position: 'absolute', top: '10px', left: '10px' }}>
          {product.category}
        </span>
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2d2d2d', lineHeight: 1.3 }}>{product.name}</h3>
        <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5, flex: 1 }}>
          {product.description.length > 70 ? product.description.substring(0, 70) + '...' : product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StarRating rating={Math.round(product.avgRating)} size={16} />
          <span style={{ fontSize: '13px', color: '#888' }}>
            {product.avgRating > 0 ? product.avgRating + ' (' + product.reviewCount + ' avis)' : 'Pas encore note'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#e8572a' }}>{product.price.toFixed(2)} euro</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Link to={'/product/' + product._id} className="btn-primary" style={{ textDecoration: 'none', fontSize: '12px', padding: '6px 14px' }}>
              Voir les avis
            </Link>
            {isAdmin && (
              <>
                <Link to={'/edit-product/' + product._id} style={{ background: '#eaf3fb', color: '#1a6fa8', border: '1px solid #b5d4f4', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>
                  Modifier
                </Link>
                <button className="btn-danger" onClick={() => onDelete(product._id)} style={{ padding: '6px 10px', fontSize: '12px' }}>
                  Suppr
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
