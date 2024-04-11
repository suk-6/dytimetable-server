const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_ID, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT } = process.env;
const dbUrl = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/admin`;

module.exports = mongoose.connect(dbUrl, {
    dbName: 'dytimetable',
});;