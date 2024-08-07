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
const uri = 'mongodb+srv://krystalloquartz:t1OZku8vzjBJE0qG@cluster0.mongodb.net/base_datos?retryWrites=true&w=majority:27017';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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

// Ruta para manejar las solicitudes de pedidos
app.post('/orders', async (req, res) => {
  const cart = req.body.cart;

  // Añadir registro de depuración
  console.log('Datos recibidos en el servidor:', cart);

  try {
    const newOrder = await Order.insertMany(cart);
    res.status(201).json(newOrder);
  } catch (error) {
    console.log('Error al insertar en MongoDB:', error);
    res.status(400).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
