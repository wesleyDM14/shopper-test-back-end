const db = require('../db');
const pack_controller = require('./pack.controller');

const getAllProductsFromDb = async (req, res) => {
    try {
        const products = await db.selectProducts();
        return res.status(200).send({
            message: "Lista de Produtos cadastrados no Sistema",
            data: products[0],
        });
    } catch (error) {
        console.error(error);
    }
}

const getAllProductFromArray = async (products, res) => {
    let productsResponse = [];
    for (const element of products) {
        let productTemp = {}
        //Verifica se os campos estão preenchidos no arquivo csv.
        if (element.product_code && element.new_price) {
            //verifica se os campos são valores numericos e chega espaços em branco entre eles
            if ((isNaN(element.product_code) && isNaN(parseInt(element.product_code))) || (isNaN(element.new_price) && isNaN(parseFloat(element.new_price)))) {
                productTemp = { code: '--', name: '--', cost_price: '--', sales_price: '--', message: 'Valores invlálidos (Não numérico) no arquivo CSV.' }
            } else {
                let productCode = parseInt(element.product_code);
                let productAlreadyExists = await db.selectOneProduct(productCode);
                //Verifica se o codigo do produto existe no banco de dados
                if (productAlreadyExists[0].length > 0) {
                    let temp = productAlreadyExists[0];
                    //Verifica se o novo preço é maior que o preço de custo.
                    let floatNewValue = parseFloat(element.new_price);
                    let floatActualCostPrice = parseFloat(temp[0].cost_price);
                    if (floatNewValue >= floatActualCostPrice) {
                        //Verifica se o novo preço é dentro da margem de 10% de diferença do preço atual
                        let floatActualSalesPrice = parseFloat(temp[0].sales_price);
                        let diff = floatNewValue - floatActualSalesPrice;
                        let percentDiff = (Math.abs(diff) / floatActualSalesPrice) * 100;
                        if (percentDiff > 10) {
                            productTemp = { code: productCode, name: temp[0].name, cost_price: temp[0].cost_price, sales_price: temp[0].sales_price, message: 'Novo valor acima da margem de 10% de reajuste.' }
                        } else {
                            productTemp = { code: productCode, name: temp[0].name, cost_price: temp[0].cost_price, sales_price: element.new_price, message: 'OK.' }
                        }
                    } else {
                        console.log(temp[0]);
                        productTemp = { code: productCode, name: temp[0].name, cost_price: temp[0].cost_price, sales_price: temp[0].sales_price, message: 'Novo valor menor que preço de custo.' }
                    }
                } else {
                    productTemp = { code: productCode, name: '--', cost_price: '--', sales_price: '--', message: 'Código de produto não encontrado.' }
                }
            }
        } else {
            productTemp = { code: '--', name: '--', cost_price: '--', sales_price: '--', message: 'Campos Incompletos no arquivo CSV.' }
        }
        productsResponse.push(productTemp);
    }

    return verifyPacksAndComponentsValues(productsResponse, res);
}

const verifyPacksAndComponentsValues = async (products, res) => {
    let arrayResponse = Array(products);
    let packsInDB = await pack_controller.getAllPacksFromDb();

    for (let product of arrayResponse[0]) {
        let packsInlist = [];
        for (let pack of packsInDB) {
            if (product.code == pack.pack_id) {
                packsInlist.push({ product_id: pack.product_id, qty: pack.qty });
            }
        }
        if (packsInlist.length > 0) {
            let sucessCount = 0;
            let totalValue = 0;
            let sucessCodes = [];
            packsInlist.forEach((element) => {
                const i = arrayResponse[0].findIndex(e => e.code === element.product_id);
                if (i > -1) {
                    sucessCount += 1;
                    let temp = arrayResponse[0];
                    totalValue += temp[i].sales_price;
                    sucessCodes.push({ id: element.product_id, sales_price: temp[i].sales_price });
                }
            });
            if (sucessCount > 0) {
                if (totalValue !== product.sales_price) {
                    let totalAux = 0;
                    for (let element of packsInlist) {
                        const i = sucessCodes.findIndex(e => e.id === element.product_id);
                        if (i > -1) {
                            totalAux += parseFloat(sucessCodes[i].sales_price) * element.qty;
                        } else {
                            let productTemp = await db.selectOneProduct(element.product_id);
                            let aux = productTemp[0];
                            let priceTemp = parseFloat(aux[0].sales_price) * element.qty;
                            totalAux += priceTemp;
                        }
                    }

                    if (totalAux !== parseFloat(product.sales_price)) {
                        product.message = 'O preço final do PACK nao confere com a soma dos preços individuais.';
                    }
                }
            } else {
                product.message = 'Componente do pack faltando na lista CSV.';
            }
        }
    }

    global.LastArrayCSV = arrayResponse;

    return res.status(200).send({
        message: "Lista de Produtos carregado do arquivo CSV.",
        data: arrayResponse,
    });

}

module.exports = { getAllProductsFromDb, getAllProductFromArray }