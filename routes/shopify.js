const express = require('express');
const axios = require('axios');
const router = express.Router();

const shopifyRouter = () => {
  router.get('/shopify/products', async (req, res) => {
    try {
      const shopifyResponse = await axios.get(`https://${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_API_PASSWORD}@${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-01/collections/478674190640/products.json`);

      res.json(shopifyResponse.data.products);  // Envía los productos al frontend
    } catch (error) {
      console.error('Error fetching products from Shopify:', error.message);
      res.status(500).json({ error: 'Error fetching products from Shopify' });
    }
  });
}

module.exports = shopifyRouter;