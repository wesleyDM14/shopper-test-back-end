const fs = require('fs');
const fast_csv = require('fast-csv');

const uploadProducts = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send('Please upload a CSV file!');
        }

        let products = [];
        let path = './resources/static/assets/uploads/' + req.file.filename;

        fs.createReadStream(path)
            .pipe(fast_csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on('data', (row) => {
                products.push(row);
            })
            .on('end', () => {
                //register all products from products array
            });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Failed to upload the file: " + req.file.originalname,
        });
    }
};

export default {
    uploadProducts,
}