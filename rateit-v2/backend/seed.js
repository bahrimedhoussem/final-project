const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User     = require('./models/User');
const Product  = require('./models/Product');
const Review   = require('./models/Review');
const Category = require('./models/Category');

// ─── CATÉGORIES ───────────────────────────────────────────
const categoriesData = [
  'Electronique',
  'Chaussures',
  'Mode & Vetements',
  'Maison & Deco',
  'Livres',
  'Sport & Fitness',
  'Alimentation',
  'Beaute & Soin',
  'Jeux Video',
  'Voyage & Bagages'
];

// ─── PRODUITS ─────────────────────────────────────────────
const productsData = [
  // ELECTRONIQUE
  {
    name: 'iPhone 15 Pro',
    category: 'Electronique',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    description: 'Smartphone Apple avec puce A17 Pro, camera 48MP et ecran Super Retina XDR 6.1 pouces. Design en titane ultra leger.'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronique',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    description: 'Flagship Samsung avec stylet S Pen integre, camera 200MP et ecran Dynamic AMOLED 6.8 pouces. Autonomie exceptionnelle.'
  },
  {
    name: 'MacBook Air M2',
    category: 'Electronique',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    description: 'Ordinateur portable ultra fin avec puce M2, 8GB RAM, 256GB SSD. Autonomie 18h et ecran Liquid Retina 13.6 pouces.'
  },
  {
    name: 'Sony WH-1000XM5',
    category: 'Electronique',
    price: 349,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    description: 'Casque Bluetooth a reduction de bruit active leader du marche. 30h d autonomie, son Hi-Res Audio, confort premium.'
  },
  {
    name: 'iPad Pro 12.9 M2',
    category: 'Electronique',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    description: 'Tablette professionnelle avec puce M2, ecran Liquid Retina XDR, compatible Apple Pencil 2. Parfaite pour les creatifs.'
  },

  // CHAUSSURES
  {
    name: 'Nike Air Max 270',
    category: 'Chaussures',
    price: 149,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    description: 'Baskets lifestyle avec la plus grande unite Air Max a la cheville. Amorti exceptionnel et style iconique pour usage quotidien.'
  },
  {
    name: 'Adidas Ultraboost 23',
    category: 'Chaussures',
    price: 189,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    description: 'Chaussure de running haut de gamme avec semelle Boost pour un retour d energie maximal. Tige en Primeknit ultra confortable.'
  },
  {
    name: 'Converse Chuck Taylor All Star',
    category: 'Chaussures',
    price: 65,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400',
    description: 'La sneaker classique indemodable depuis 1917. Tige en toile, semelle en caoutchouc, disponible en dozens de coloris.'
  },
  {
    name: 'New Balance 574',
    category: 'Chaussures',
    price: 99,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400',
    description: 'Sneaker retro confortable avec semelle ENCAP pour un maintien et un amorti optimaux. Style intemporel made in USA.'
  },

  // MODE & VETEMENTS
  {
    name: 'Veste en jean Levi s',
    category: 'Mode & Vetements',
    price: 89,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
    description: 'Veste en denim iconique Levi s, coupe trucker classique. 100% coton, finitions soignees, un essentiel du dressing.'
  },
  {
    name: 'Sac a dos Fjallraven Kanken',
    category: 'Mode & Vetements',
    price: 120,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    description: 'Le sac iconique suedois en Vinylon F, durable et impermeable. Parfait pour l ecole, le bureau ou les voyages urbains.'
  },
  {
    name: 'Montre Casio F-91W',
    category: 'Mode & Vetements',
    price: 22,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'La montre digitale la plus iconique du monde. Resistance a l eau 30m, pile 7 ans, alarme et chronographe. Un classique absolu.'
  },

  // MAISON & DECO
  {
    name: 'Cafetiere Nespresso Vertuo',
    category: 'Maison & Deco',
    price: 149,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    description: 'Machine a cafe a capsules nouvelle generation. Reconnaissance automatique des capsules, 5 tailles de tasse, chauffe en 30 secondes.'
  },
  {
    name: 'Plante Monstera Deliciosa',
    category: 'Maison & Deco',
    price: 35,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    description: 'Plante tropicale decorative aux grandes feuilles perforees caracteristiques. Facile d entretien, pousse rapidement, purifie l air.'
  },
  {
    name: 'Lampe de bureau LED Xiaomi',
    category: 'Maison & Deco',
    price: 45,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    description: 'Lampe de bureau intelligente avec reglage de luminosite et temperature de couleur. Chargeur USB integre, design minimaliste elegant.'
  },
  {
    name: 'Diffuseur huiles essentielles',
    category: 'Maison & Deco',
    price: 39,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
    description: 'Diffuseur ultrasonique 500ml avec lumiere LED multicolore. 10 niveaux de brume, minuterie programmable, silencieux et elegant.'
  },

  // LIVRES
  {
    name: 'Clean Code - Robert Martin',
    category: 'Livres',
    price: 38,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    description: 'La bible du developpeur pour ecrire du code propre, lisible et maintenable. Indispensable pour tout programmeur professionnel.'
  },
  {
    name: 'Atomic Habits - James Clear',
    category: 'Livres',
    price: 24,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    description: 'Transformez vos habitudes et votre vie avec des changements minuscules. Vendu a plus de 10 millions d exemplaires dans le monde.'
  },
  {
    name: 'Le Petit Prince - Saint-Exupery',
    category: 'Livres',
    price: 9,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    description: 'Le chef-d oeuvre de la litterature mondiale traduit en 300 langues. Un conte poetique et philosophique pour petits et grands.'
  },

  // SPORT & FITNESS
  {
    name: 'Tapis de yoga premium',
    category: 'Sport & Fitness',
    price: 59,
    image: 'https://images.unsplash.com/photo-1601925228946-d0b41d87fbd5?w=400',
    description: 'Tapis de yoga antiderapant 6mm en TPE ecologique. Surface texturee pour une adherence maximale, lignes d alignement imprimees.'
  },
  {
    name: 'Halteres reglables 20kg',
    category: 'Sport & Fitness',
    price: 129,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    description: 'Paire d halteres reglables de 2 a 20kg chacun. Systeme de verrouillage rapide, poignee ergonomique antiderapante, compact et polyvalent.'
  },
  {
    name: 'Velo elliptique connecte',
    category: 'Sport & Fitness',
    price: 499,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    description: 'Elliptique pliable avec 16 niveaux de resistance, ecran LCD, capteurs cardiaques et compatibilite applications fitness. Silencieux.'
  },

  // ALIMENTATION
  {
    name: 'Cafe en grains Ethiopia',
    category: 'Alimentation',
    price: 18,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    description: 'Cafe specialty grade single origin d Ethiopie, notes de fruits rouges et jasmin. Torrefaction artisanale, 250g, commerce equitable.'
  },
  {
    name: 'Huile d olive extra vierge',
    category: 'Alimentation',
    price: 22,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    description: 'Huile d olive extra vierge premiere pression a froid, appellation d origine protegee. Notes fruitees et peppery, bouteille 75cl.'
  },
  {
    name: 'Chocolat noir Valrhona 85%',
    category: 'Alimentation',
    price: 12,
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400',
    description: 'Tablette de chocolat noir d exception 85% cacao, Grand Cru de plantation. Notes intenses de fruits secs et de cafe, fondant en bouche.'
  },

  // BEAUTE & SOIN
  {
    name: 'Serum Vitamine C Ordinary',
    category: 'Beaute & Soin',
    price: 16,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    description: 'Serum eclat concentre en vitamine C 23% + HA Spheres 2%. Reduit les taches, unifie le teint, protection antioxydante puissante.'
  },
  {
    name: 'Creme hydratante Cetaphil',
    category: 'Beaute & Soin',
    price: 19,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    description: 'Creme hydratante intensive pour peaux seches et sensibles. Sans parfum, sans parabens, recommandee par les dermatologues. 250g.'
  },

  // JEUX VIDEO
  {
    name: 'PlayStation 5',
    category: 'Jeux Video',
    price: 549,
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400',
    description: 'Console next-gen Sony avec SSD ultra-rapide (temps de chargement quasi nuls), ray tracing, 4K 120fps et manette DualSense haptique.'
  },
  {
    name: 'Nintendo Switch OLED',
    category: 'Jeux Video',
    price: 349,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    description: 'Console hybride avec ecran OLED 7 pouces vibrant, dock TV inclus, 64GB stockage. Jouez partout en mode portable ou en salon.'
  },

  // VOYAGE & BAGAGES
  {
    name: 'Valise Samsonite Spinner',
    category: 'Voyage & Bagages',
    price: 189,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
    description: 'Valise rigide 4 roues multidirectionnelles, serrure TSA integree, coque en polypropylene ultra resistant. Taille cabine 55cm.'
  },
  {
    name: 'Sac de voyage Eastpak',
    category: 'Voyage & Bagages',
    price: 79,
    image: 'https://images.unsplash.com/photo-1553531384-397c80973a0b?w=400',
    description: 'Sac duffle 42L en nylon resistant avec sangle epaule rembourrée. Compartiment chaussures separe, garantie 30 ans. Ideal week-end.'
  },
];

// ─── AVIS RÉALISTES ───────────────────────────────────────
const reviewsTemplates = [
  { rating: 5, comment: 'Produit absolument parfait, je recommande les yeux fermes ! Qualite au rendez-vous et livraison rapide.' },
  { rating: 5, comment: 'Exactement ce que je cherchais. Tres bon rapport qualite prix, je suis pleinement satisfait.' },
  { rating: 4, comment: 'Tres bon produit dans l ensemble. Quelques petits details a ameliorer mais globalement excellent.' },
  { rating: 4, comment: 'Bonne qualite, je suis content de mon achat. La description correspond bien au produit recu.' },
  { rating: 3, comment: 'Produit correct mais pas exceptionnel. Je m attendais a mieux pour ce prix. A voir sur la duree.' },
  { rating: 5, comment: 'Impressionnant ! Vraiment au-dela de mes attentes. La qualite de fabrication est remarquable.' },
  { rating: 4, comment: 'Bon produit, conforme a la description. Je l utilise depuis quelques semaines et tout va bien.' },
  { rating: 5, comment: 'Achat coup de coeur ! Je n aurais pas pu faire un meilleur choix. Je recommande vivement.' },
  { rating: 2, comment: 'Decu par ce produit. La qualite n est pas a la hauteur du prix. Je ne recommande pas.' },
  { rating: 5, comment: 'Parfait en tout point. Design soigne, fonctionnalites completes, utilisation intuitive. Top !' },
  { rating: 4, comment: 'Tres satisfait de mon achat. Bon produit fiable que j utilise tous les jours sans probleme.' },
  { rating: 3, comment: 'Correct sans plus. Ca fait le travail mais rien d extraordinaire. Rapport qualite prix moyen.' },
  { rating: 5, comment: 'Un must-have ! Je regrette de ne pas l avoir achete plus tot. Vraiment indispensable.' },
  { rating: 4, comment: 'Belle qualite de fabrication. Quelques semaines d utilisation et toujours aussi satisfait.' },
  { rating: 5, comment: 'Exceptionnel ! Meilleur achat de l annee sans hesiter. Tout le monde devrait l avoir.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connecte');

  // Vider les collections
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Category.deleteMany({})
  ]);
  console.log('Collections videes');

  // Créer les utilisateurs
  const admin = await User.create({
    name: 'Admin RateIt',
    email: 'admin@rateit.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin'
  });

  const users = await Promise.all([
    User.create({ name: 'Sophie Martin',  email: 'sophie@gmail.com',  password: await bcrypt.hash('user123', 10), role: 'user' }),
    User.create({ name: 'Karim Bouzid',   email: 'karim@gmail.com',   password: await bcrypt.hash('user123', 10), role: 'user' }),
    User.create({ name: 'Amina Rousseau', email: 'amina@gmail.com',   password: await bcrypt.hash('user123', 10), role: 'user' }),
    User.create({ name: 'Thomas Dupont',  email: 'thomas@gmail.com',  password: await bcrypt.hash('user123', 10), role: 'user' }),
    User.create({ name: 'Lina Ferreira',  email: 'lina@gmail.com',    password: await bcrypt.hash('user123', 10), role: 'user' }),
  ]);
  console.log('Utilisateurs crees : 1 admin + 5 membres');

  // Créer les catégories
  await Promise.all(categoriesData.map(name => Category.create({ name, createdBy: admin._id })));
  console.log('Categories creees : ' + categoriesData.length);

  // Créer les produits
  const createdProducts = await Promise.all(
    productsData.map(p => Product.create({ ...p, createdBy: admin._id }))
  );
  console.log('Produits crees : ' + createdProducts.length);

  // Créer les avis (2 à 4 avis par produit)
  const reviews = [];
  createdProducts.forEach((product, i) => {
    // Nombre d'avis entre 2 et 4
    const nbAvis = (i % 3) + 2;
    for (let j = 0; j < nbAvis; j++) {
      const user = users[(i + j) % users.length];
      const template = reviewsTemplates[(i * 2 + j) % reviewsTemplates.length];
      reviews.push({
        product: product._id,
        user: user._id,
        rating: template.rating,
        comment: template.comment
      });
    }
  });

  await Review.insertMany(reviews);
  console.log('Avis crees : ' + reviews.length);

  console.log('\n========================================');
  console.log('  BASE DE DONNEES PRETE !');
  console.log('========================================');
  console.log('  ADMIN  : admin@rateit.com  / admin123');
  console.log('  USER 1 : sophie@gmail.com  / user123');
  console.log('  USER 2 : karim@gmail.com   / user123');
  console.log('  USER 3 : amina@gmail.com   / user123');
  console.log('  USER 4 : thomas@gmail.com  / user123');
  console.log('  USER 5 : lina@gmail.com    / user123');
  console.log('========================================');
  console.log('  30 produits | 10 categories | ' + reviews.length + ' avis');
  console.log('========================================\n');

  mongoose.disconnect();
}

seed().catch(console.error);
