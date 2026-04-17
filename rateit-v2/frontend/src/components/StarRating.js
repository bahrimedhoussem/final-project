import React from 'react';

export default function StarRating({ rating, onSelect, size = 22 }) {
  return (
    <div style={{ display: 'inline-flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onSelect && onSelect(s)}
          style={{
            fontSize: `${size}px`, cursor: onSelect ? 'pointer' : 'default',
            color: s <= rating ? '#e8a020' : '#ddd',
            transition: 'color 0.1s', userSelect: 'none',
            lineHeight: 1,
          }}>★</span>
      ))}
    </div>
  );
}
