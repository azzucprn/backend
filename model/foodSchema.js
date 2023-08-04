const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please provide valid image url"],
  },
  foodName: {
    type: String,
    required: [true, "Please provide valid food name"],
  },
  expDate: {
    type: String,
    required: [true, "Expiry Date required."],
  },
  address: {
    type: String,
    required: [true, "address required for pickup"],
  },
});

// Modal is what we used to perform all the operation upon.
module.exports = mongoose.model("FoodSchema", foodSchema);
