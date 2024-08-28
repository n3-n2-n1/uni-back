const express = require('express');
const axios = require('axios');

const shopifyRouter = () => {
  const router = express.Router();

  // Configuración de Axios con Admin API Access Token (en lugar de Storefront Access Token)
  const shopifyAxios = axios.create({
    baseURL: `https://012078-0f.myshopify.com/admin/api/2024-01`,
    auth: {
      username: '33dbd23a06e1f9e5872d5b9c8bc99a2b',  // Reemplaza con tu API Key
      password: 'ca162fb9dba5d39e008afec0376fa826'  // Reemplaza con tu API Password
    },
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000  // 30 segundos de timeout
  });

  router.get('/shopify/products', async (req, res) => {
    try {
      const shopifyResponse = await shopifyAxios.get('/collections/478674190640/products.json');
      const products = shopifyResponse.data.products.map(product => ({
        id: product.id,
        title: product.title,
        price: product.variants[0].price,
        image: product.image.src
      }));
      res.json(products);  // Envía los productos al frontend
    } catch (error) {
      console.error('Error fetching products from Shopify:', error.message);
      res.status(500).json({ error: 'Error fetching products from Shopify' });
    }
  });

  return router;
};

module.exports = shopifyRouter;
