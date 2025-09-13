const mongoose = require("mongoose");
require("dotenv").config();

const databaseConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000
    }
  );
};

module.exports = databaseConnection;
