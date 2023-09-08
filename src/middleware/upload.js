const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        const dir = './resources/static/assets/uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const csvFilter = (_req, file, cb) => {
    if (file == undefined) {
        cb('Please upload a file to proceed.', false);
    } else if (file.mimetype.includes('csv')) {
        cb(null, true);
    } else {
        cb('Please upload only csv file as conly CSV is supported for now.', false);
    }
};

module.exports = multer({
    storage: storage,
    fileFilter: csvFilter
});