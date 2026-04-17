const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecte'))
  .catch(err => console.log('Erreur MongoDB:', err));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/categories', require('./routes/categories'));

app.get('/', (req, res) => res.json({ message: 'RateIt API v2 OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Serveur sur http://localhost:' + PORT));
