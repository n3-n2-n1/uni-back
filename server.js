const express = require('express');
const mongoose = require('mongoose');
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
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 segundos para seleccionar servidor
  socketTimeoutMS: 45000, // 45 segundos para timeout de socket
  connectTimeoutMS: 30000, // 30 segundos para timeout de conexión
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Esquema y modelo de Pedido
const orderSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  image: String,
});

const Order = mongoose.model('Order', orderSchema);

// Tamaño del lote para la inserción en lotes
const BATCH_SIZE = 10;

// Ruta para manejar las solicitudes de pedidos
app.post('/orders', async (req, res) => {
  const cart = req.body.cart;
  console.log('Datos recibidos en el servidor:', cart);

  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ error: 'No hay conexión a la base de datos' });
  }

  try {
    const chunks = [];
    for (let i = 0; i < cart.length; i += BATCH_SIZE) {
      chunks.push(cart.slice(i, i + BATCH_SIZE));
    }

    const results = [];
    for (const chunk of chunks) {
      const newOrder = await Order.insertMany(chunk);
      results.push(...newOrder);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo entre lotes
    }
    res.status(201).json(results);
  } catch (error) {
    console.error('Error al insertar en MongoDB:', error);
    res.status(400).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
