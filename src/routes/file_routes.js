const express = require('express');
const db = require('../db');
const csvController = require('../controllers/csv.controller.js');
const upload = require('../middleware/upload.js');

const file_routes = express.Router();

file_routes.post('/csv/upload', upload.single('file'), csvController.uploadProducts);

module.exports = file_routes;