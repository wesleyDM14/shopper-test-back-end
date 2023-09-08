const express = require("express");
const db = require('../db');
const products_controler = require('../controllers/products.controller');

const products_routes = express.Router();

products_routes.get('/products', products_controler.getAllProductsFromDb);

module.exports = products_routes;