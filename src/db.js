const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

//Create a DB connection with a .ENV config
async function connect() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        global.connection = connection;

        return connection;
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - Create Product
async function insertProduct(product) {
    try {
        const conn = await connect();
        const sql = 'INSERT INTO products(code,name,cost_price,sales_price) VALUES (?,?,?,?);';
        const values = [product.code, product.name, product.cost_price, product.sales_price];
        return await conn.query(sql, values);
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - READ ALL
async function selectProducts() {
    try {
        const conn = await connect();
        return await conn.query('SELECT * FROM products;');
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - READ Specific Product
async function selectOneProduct(productCode) {
    try {
        const conn = await connect();
        const sql = 'SELECT * FROM products WHERE code = ?';
        return await conn.query(sql, [productCode]);
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - Update Product
async function updateProduct(productCode, product) {
    try {
        const conn = await connect();
        const sql = 'UPDATE products SET name=?, cost_price=?, sales_price=? WHERE code=?';
        const values = [product.name, product.cost_price, product.sales_price, productCode];
        return await conn.query(sql, values);
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - Delete product
async function deleteProduct(productCode) {
    try {
        const conn = await connect();
        const sql = 'DELETE FROM products WHERE code=?';
        return await conn.query(sql, [productCode]);
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - Create Pack
async function insertPack(pack) {
    try {
        const conn = await connect();
        const sql = 'INSERT INTO packs (pack_id,product_id,qty) VALUES (?,?,?);';
        const values = [pack.pack_id, pack.product_id, pack.qty];
        return await conn.query(sql, values);
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - READ ALL
async function selectPacks() {
    try {
        const conn = await connect();
        return await conn.query('SELECT * FROM packs;');
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - READ Specific Pack
async function selectOnePack(id) {
    try {
        const conn = await connect();
        const sql = 'SELECT * FROM packs WHERE id = ?';
        return await conn.query(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - Update Pack
async function updatePack(id, pack) {
    try {
        const conn = await connect();
        const sql = 'UPDATE packs SET pack_id=?, product_id=?, qty=? WHERE id=?';
        const values = [pack.pack_id, pack.product_id, pack.qty, id];
        return await conn.query(sql, values);
    } catch (error) {
        console.error(error);
    }
}

//CRUD OPERATION - Delete product
async function deletePack(id) {
    try {
        const conn = await connect();
        const sql = 'DELETE FROM packs WHERE id=?';
        return await conn.query(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { insertProduct, selectProducts, selectOneProduct, updateProduct, deleteProduct, insertPack, selectPacks, selectOnePack, updatePack, deletePack }