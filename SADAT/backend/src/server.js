const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas

app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI,).then(() => {
  console.log('Conectado a MongoDB');
}).catch((err) => {
  console.error('Error de conexión a MongoDB:', err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
