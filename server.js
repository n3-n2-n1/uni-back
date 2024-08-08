require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
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

// Conexión a la base de datos MySQL en RDS usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Ruta para manejar las solicitudes de pedidos
app.post('/orders', async (req, res) => {
  const cart = req.body.cart;
  console.log('Datos recibidos en el servidor:', cart);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    const query = 'INSERT INTO orders (id, name, description, price, quantity, image) VALUES ?';
    const values = cart.map(item => [item.id, item.name, item.description, item.price, item.quantity, item.image]);

    await connection.query(query, [values]);
    await connection.commit();

    res.status(201).json({ message: 'Pedidos insertados correctamente' });
  } catch (error) {
    console.error('Error al insertar en MySQL:', error);
    if (connection) {
      await connection.rollback();
    }
    res.status(400).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Nueva ruta para obtener todos los pedidos
app.get('/orders', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM orders');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los pedidos de MySQL:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
