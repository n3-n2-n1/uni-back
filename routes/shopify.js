const express = require('express');
const axios = require('axios');

const shopifyRouter = () => {
  const router = express.Router();

  // Configuración de Axios con un timeout optimizado
  const shopifyAxios = axios.create({
    baseURL: `https://012078-0f.myshopify.com/api/unstable/graphql.json`,
    headers: {
      'X-Shopify-Storefront-Access-Token': '124cc182b560cc1a0aaa3d2993474093',
      'Content-Type': 'application/json'
    },
    timeout: 30000  // 30 segundos de timeout, aunque 50 segundos es el máximo en Vercel
  });

  router.get('/shopify/products', async (req, res) => {
    const query = `
      {
        collection(id: "gid://shopify/Collection/478674190640") {
          products(first: 5) {  // Limita a 5 productos para optimización
            edges {
              node {
                id
                title
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const shopifyResponse = await shopifyAxios.post('', { query });
      const products = shopifyResponse.data.data.collection.products.edges.map(edge => edge.node);
      res.json(products);  // Envía los productos al frontend
    } catch (error) {
      console.error('Error fetching products from Shopify:', error.message);
      res.status(500).json({ error: 'Error fetching products from Shopify' });
    }
  });

  return router; // No olvides retornar el router
};

module.exports = shopifyRouter;
