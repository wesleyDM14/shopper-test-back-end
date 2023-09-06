const express = require('express');
const dotenv = require('dotenv');

const db = require("./db");

const server = express();
dotenv.config();

server.listen(process.env.PORT, () => console.log(`Server up in port ${process.env.PORT}.`));