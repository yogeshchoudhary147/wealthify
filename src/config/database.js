const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://yogeshchoudhary:Iig4YGZt1R1TX9NY@wealthify.gzvlt.mongodb.net/wealthify"
  );
};

module.exports = connectDB;
