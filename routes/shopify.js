const express = require('express');
const axios = require('axios');

const shopifyRouter = () => {
  const router = express.Router();

  // Configuración de Axios con el token de acceso para Storefront API
  const shopifyAxios = axios.create({
    baseURL: `https://012078-0f.myshopify.com/api/unstable/graphql.json`,
    headers: {
      'X-Shopify-Storefront-Access-Token': '124cc182b560cc1a0aaa3d2993474093', // Asegúrate de que esta variable esté configurada correctamente
      'Content-Type': 'application/json'
    }
  });

  router.get('/shopify/products', async (req, res) => {
    const query = `
      {
        collection(id: "gid://shopify/Collection/478674190640") {
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      src
                    }
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
