const express = require('express');
const db = require('../db');
const csvController = require('../controllers/csv.controller.js');
const upload = require('../middleware/upload.js');

const file_routes = express.Router();

file_routes.post('/csv/upload', upload.single('file'), csvController.uploadProducts);

file_routes.get('/csv/validate', (req, res) => {
    let arrayTemp = global.LastArrayCSV;
    for (element of arrayTemp[0]){
        if (element.message !== 'OK.'){
            return res.status(200).send({
                message: "Arquivo csv quebra regras.",
            });
        }
    }
    return res.status(200).send({
        message: "Ok.",
    });
});

file_routes.post('/csv/update', async (req, res) => {
    let arrayTemp = global.LastArrayCSV;

    if (arrayTemp.length > 0){
        try {
            for (element of arrayTemp[0]){
                let db_response = await db.updateProduct(element.code, element);
            }
            return res.status(200).send({
                message: 'DB Atualizado com sucesso!'
            })
        } catch (error) {
            return res.status(500).send({
                message: 'Algum erro aconteceu durante a atualização do banco de dados.'
            })
        }
        
    }
});

module.exports = file_routes;