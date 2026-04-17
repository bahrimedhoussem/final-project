import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products,   setProducts]   = useState([]);
  const [allProducts,setAllProducts]= useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('Tous');
  const [minPrice,   setMinPrice]   = useState('');
  const [maxPrice,   setMaxPrice]   = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Charger tout au démarrage
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filtrer côté frontend à chaque changement
  useEffect(() => {
    filterProducts();
  }, [search, category, minPrice, maxPrice, allProducts]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setAllProducts(res.data);
      setProducts(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Filtrage 100% côté frontend — simple et fiable
  const filterProducts = () => {
    let result = [...allProducts];

    // Filtre recherche
    if (search.trim() !== '') {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtre catégorie
    if (category !== 'Tous') {
      result = result.filter(p => p.category === category);
    }

    // Filtre prix min
    if (minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    // Filtre prix max
    if (maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    setProducts(result);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete('/products/' + id);
      setAllProducts(allProducts.filter(p => p._id !== id));
    } catch { alert('Erreur lors de la suppression'); }
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('Tous');
    setMinPrice('');
    setMaxPrice('');
  };

  const allCats = ['Tous', ...categories.map(c => c.name)];
  const hasFilters = search || category !== 'Tous' || minPrice || maxPrice;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#2d2d2d', marginBottom: '10px' }}>
          Découvrez les meilleurs produits
        </h1>
        <p style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>
          Lisez des avis honnêtes et partagez votre expérience
        </p>

        {/* Barre de recherche */}
        <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
          <input
            className="input"
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '44px', height: '48px', borderRadius: '30px' }}
          />
          {/* Croix pour effacer */}
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
              background: '#ddd', border: 'none', borderRadius: '50%',
              width: '22px', height: '22px', cursor: 'pointer', fontSize: '13px', color: '#555',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          )}
        </div>
      </div>

      {/* Filtre prix */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>Prix :</span>
        <input
          className="input" type="number" placeholder="Min €"
          value={minPrice} onChange={e => setMinPrice(e.target.value)}
          style={{ width: '90px', padding: '7px 12px', fontSize: '13px' }}
        />
        <span style={{ color: '#bbb' }}>—</span>
        <input
          className="input" type="number" placeholder="Max €"
          value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
          style={{ width: '90px', padding: '7px 12px', fontSize: '13px' }}
        />
        {hasFilters && (
          <button onClick={resetFilters} style={{
            background: '#fff0ee', border: '1px solid #f5c6c0',
            color: '#e8572a', padding: '7px 16px', borderRadius: '20px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          }}>
            Effacer filtres
          </button>
        )}
      </div>

      {/* Filtres catégories */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px', justifyContent: 'center' }}>
        {allCats.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '8px 20px', borderRadius: '30px',
            border: category === cat ? 'none' : '1.5px solid #e0d8d0',
            background: category === cat ? '#e8572a' : 'white',
            color: category === cat ? 'white' : '#555',
            fontWeight: 500, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Résultats */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
          Chargement des produits...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>Aucun produit trouvé</p>
          <p style={{ fontSize: '14px', marginBottom: '20px' }}>Essayez un autre mot-clé</p>
          {hasFilters && (
            <button onClick={resetFilters} className="btn-primary">
              Voir tous les produits
            </button>
          )}
        </div>
      ) : (
        <>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
            {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            {hasFilters && <span style={{ color: '#e8572a', marginLeft: '8px' }}>— filtres actifs</span>}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {products.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                isAdmin={user?.role === 'admin'}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
