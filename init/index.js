require('dotenv').config()

const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '693f106768cd0372d70592fc'}));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();