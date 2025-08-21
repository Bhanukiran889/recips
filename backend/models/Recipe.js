// models/Recipe.js
const mongoose = require('mongoose');

const NutrientsSchema = new mongoose.Schema({
  calories: String,
  carbohydrateContent: String,
  cholesterolContent: String,
  fiberContent: String,
  proteinContent: String,
  saturatedFatContent: String,
  sodiumContent: String,
  sugarContent: String,
  fatContent: String,
  unsaturatedFatContent: String
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  cuisine: { type: String, index: true },
  title: { type: String, required: true, index: true },
  rating: { type: Number, default: null, index: true },
  prep_time: { type: Number, default: null },
  cook_time: { type: Number, default: null },
  total_time: { type: Number, default: null, index: true },
  description: { type: String },
  nutrients: { type: NutrientsSchema },
  calories_num: { type: Number, default: null, index: true }, // parsed numeric calories
  serves: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
