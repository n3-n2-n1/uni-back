const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://uni-poc.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Conexión a MongoDB Atlas
const uri = 'mongodb+srv://krystalloquartz:t1OZku8vzjBJE0qG@cluster0.mongodb.net/uni-test?retryWrites=true&w=majority';
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('uni-test');
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Ruta para manejar las solicitudes de pedidos
app.post('/orders', async (req, res) => {
  const cart = req.body.cart;

  // Añadir registro de depuración
  console.log('Datos recibidos en el servidor:', cart);

  // Validar si cart es un array y no está vacío
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart must be a non-empty array' });
  }

  try {
    const result = await db.collection('orders').insertMany(cart);
    console.log('Datos insertados en MongoDB:', result.ops);
    res.status(201).json(result.ops);
  } catch (error) {
    console.log('Error al insertar en MongoDB:', error);
    res.status(400).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
