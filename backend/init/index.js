const mongoose = require("mongoose");
const initProduct = require("./productData.js");
const Product = require("../models/product.js");

main().then(()=>{
    console.log("connection to database is successful.");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/CampusBites");
};

const initDB = async()=>{
    await Product.deleteMany({});
    await Product.insertMany(initProduct);
    console.log("data was initialised.");
};

initDB();