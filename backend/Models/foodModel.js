const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
});

const FOODITEMS = mongoose.model("food", foodSchema);
module.exports = FOODITEMS;
