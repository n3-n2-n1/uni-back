const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
const uri = 'mongodb+srv://krystalloquartz:t1OZku8vzjBJE0qG@cluster0.mlp0w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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

  try {
    const newOrder = await Order.insertMany(cart);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
