const express = require('express');
const axios = require('axios');

const shopifyRouter = () => {
  const router = express.Router();

  // Configuración de Axios con Storefront Access Token
  const shopifyAxios = axios.create({
    baseURL: `https://012078-0f.myshopify.com/api/unstable/graphql.json`,
    headers: {
      'X-Shopify-Storefront-Access-Token': '124cc182b560cc1a0aaa3d2993474093',
      'Content-Type': 'application/json'
    },
    timeout: 30000  // 30 segundos de timeout
  });

  router.get('/shopify/products', async (req, res) => {
    const query = `
      {
        collection(id: "gid://shopify/Collection/478674190640") {
          products(first: 5) {
            edges {
              node {
                id
                title
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
      const products = shopifyResponse.data.data.collection.products.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.priceRange.minVariantPrice.amount,
        image: edge.node.images.edges[0]?.node.src || ''  // Añadir imagen si está disponible
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
