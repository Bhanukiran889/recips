// scripts/import_recipes.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Recipe = require('../models/Recipe');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipesdb';

function isValidNumber(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'number') return isFinite(v);
  const n = Number(v);
  return !Number.isNaN(n) && isFinite(n);
}

function parseNumberOrNull(v) {
  if (isValidNumber(v)) return Number(v);
  // Often numbers come as strings like "NaN" or ""
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// parse calories string like "389 kcal" -> 389
function parseCalories(calStr) {
  if (!calStr || typeof calStr !== 'string') return null;
  const m = calStr.match(/(-?\d+(\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

async function main() {
  console.log('Connecting to', MONGO_URI);
  await mongoose.connect(MONGO_URI, {});

  const filePath = path.join(__dirname, '..', 'US_recieps.json');
  console.log("Looking for JSON at:", filePath);
  if (!fs.existsSync(filePath)) {
    console.error('US_recieps.json not found at project root.');
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  // The JSON appears like {"0": {...}, "1": {...}} so parse to object and iterate values
  const parsed = JSON.parse(raw);
  const records = Array.isArray(parsed) ? parsed : Object.values(parsed);

  console.log(`Found ${records.length} records. Preparing to insert...`);
  const bulk = [];

  for (const rec of records) {
    // Extract fields and sanitize numeric NaN -> null
    const cuisine = rec.cuisine || rec.Cuisine || rec.Contient || rec.Continent || null;
    const title = rec.title || rec.Title || 'Untitled';
    const rating = parseNumberOrNull(rec.rating);
    const prep_time = parseNumberOrNull(rec.prep_time);
    const cook_time = parseNumberOrNull(rec.cook_time);
    const total_time = parseNumberOrNull(rec.total_time);
    const description = rec.description || '';
    const nutrients = rec.nutrients || {};
    const serves = rec.serves || rec.servings || null;

    const calories_num = parseCalories(nutrients.calories || nutrients.caloriesContent || null);

    const doc = {
      cuisine,
      title,
      rating,
      prep_time,
      cook_time,
      total_time,
      description,
      nutrients,
      calories_num,
      serves
    };
    bulk.push(doc);
  }

  if (bulk.length === 0) {
    console.log('No records to insert.');
    process.exit(0);
  }

  console.log('Clearing existing recipes collection (if exists)...');
  try { await Recipe.collection.drop(); } catch (e) { /* ignore if missing */ }

  console.log('Inserting records...');
  await Recipe.insertMany(bulk, { ordered: false });

  console.log('Done. Inserted', bulk.length);
  mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
