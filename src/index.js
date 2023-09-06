const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const productsRoutes = require('./routes/products_routes');
const packRoutes = require('./routes/packs_rotues');
const fileRoutes = require('./routes/file_routes');

global.__basedir = path.resolve() + "/..";

const server = express();

var corsOptions = {
    origin: process.env.URL_ORIGIN,
};

server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

dotenv.config();
server.use('/api/products', productsRoutes);
server.use('/api/packs', packRoutes);
server.use('/api/files', fileRoutes);

server.listen(process.env.PORT, () => console.log(`Server up in port ${process.env.PORT}.`));