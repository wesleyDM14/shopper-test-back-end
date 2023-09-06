const express = require('express');
const dotenv = require('dotenv');

const productsRoutes = require('./routes/products_routes');
const packRoutes = require('./routes/packs_rotues');

const server = express();
dotenv.config();

server.use('/api/products', productsRoutes);
server.use('/api/packs', packRoutes);

server.listen(process.env.PORT, () => console.log(`Server up in port ${process.env.PORT}.`));