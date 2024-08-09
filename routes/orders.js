const express = require('express');

const ordersRouter = (pool) => {
  const router = express.Router();

  // Ruta para manejar las solicitudes de pedidos
  router.post('/', async (req, res) => {
    const cart = req.body.cart;
    console.log('Datos recibidos en el servidor:', cart);

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Limpiar la tabla antes de insertar los nuevos datos
      await connection.query('DELETE FROM orders');

      const query = 'INSERT INTO orders (id, name, description, price, quantity, image, provider, date) VALUES ?';
      const values = cart.map(item => [
        item.id, 
        item.name, 
        item.description, 
        item.price, 
        item.quantity, 
        item.image, 
        item.provider || 'Julia Musso',  // Si no se envía desde el frontend, se asigna aquí
        item.date || new Date() // Si no se envía desde el frontend, se asigna aquí
      ]);

      await connection.query(query, [values]);
      await connection.commit();

      res.status(201).json({ message: 'Pedidos insertados correctamente.' });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error al insertar en MySQL:', error);
      res.status(400).json({ error: error.message });
    } finally {
      if (connection) connection.release();
    }
  });

  // Nueva ruta para obtener todos los pedidos
  router.get('/', async (req, res) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM orders');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener los pedidos de MySQL:', error);
      res.status(500).json({ error: error.message });
    } finally {
      if (connection) connection.release();
    }
  });

  return router;
};

module.exports = ordersRouter;
