const express = require('express');
const axios = require('axios');

const shopifyRouter = () => {
  const router = express.Router();

  // Configuración de Axios con autenticación básica
  const shopifyAxios = axios.create({
    baseURL: `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-01`,
    auth: {
      username: process.env.SHOPIFY_API_KEY,
      password: process.env.SHOPIFY_API_PASSWORD
    }
  });

  router.get('/shopify/products', async (req, res) => {
    try {
      const shopifyResponse = await shopifyAxios.get('/collections/478674190640/products.json');
      res.json(shopifyResponse.data.products);  // Envía los productos al frontend
    } catch (error) {
      console.error('Error fetching products from Shopify:', error.message);
      res.status(500).json({ error: 'Error fetching products from Shopify' });
    }
  });

  return router;  // No olvides retornar el router
};

module.exports = shopifyRouter;
