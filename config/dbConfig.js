const mongoose = require("mongoose");

const uri =
  "mongodb+srv://ajityadav:ajit123@cluster0.550zqs9.mongodb.net/foodsharing?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    // Connect with the database...
    const connect = await mongoose.connect(uri);
    console.log(
      "Database connected successfully...",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
