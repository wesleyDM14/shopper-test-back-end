const db = require('../db');

const getAllPacksFromDb = async () => {
    try {
        const packs = await db.selectPacks();
        return packs[0];
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getAllPacksFromDb }