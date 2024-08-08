const mysql = require('mysql2/promise');

let pool;

const createPool = (config) => {
  if (!pool) {
    pool = mysql.createPool(config);
  }
  return pool;
};

const getConnection = async () => {
  if (!pool) throw new Error('No pool created. Call createPool first.');
  return pool.getConnection();
};

module.exports = { createPool, getConnection };
