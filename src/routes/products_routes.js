const express = require("express");
const db = require('../db');

const products_routes = express.Router();

products_routes.get('/products', async(req, res) => {
    try {
        const products = await db.selectProducts();
        return res.json({
            status: "SUCESS",
            message: "Lista de Produtos cadastrados no Sistema",
            data: products[0],
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = products_routes;