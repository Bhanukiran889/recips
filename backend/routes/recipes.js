// routes/recipes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// Helper: parse operator queries like ">=4.5", "<=400", "=200", "400"
function parseOpValue(input) {
  if (!input) return null;
  const m = input.match(/^(<=|>=|<|>|=)?\s*(\d+(\.\d+)?)$/);
  if (!m) return null;
  const op = m[1] || '=';
  const val = Number(m[2]);
  return { op, val };
}

// Build a mongoose range query from operator
function opToMongo(op, val) {
  switch (op) {
    case '<': return { $lt: val };
    case '<=': return { $lte: val };
    case '>': return { $gt: val };
    case '>=': return { $gte: val };
    case '=': return val;
    default: return val;
  }
}

// GET /api/recipes?page=1&limit=10
router.get('/', async (req, res) => {
  try {
    let page = Math.max(1, parseInt(req.query.page || '1'));
    let limit = Math.max(1, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;

    // Sort by rating desc, nulls last
    const sort = { rating: -1, _id: 1 };

    const total = await Recipe.countDocuments();
    const data = await Recipe.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    res.json({
      page,
      limit,
      total,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recipes/search?...query...
// Supported query params:
//  - calories (ops: <=400, >=200, =350)
//  - title (partial match, case-insensitive)
//  - cuisine (exact or partial case-insensitive)
//  - total_time (ops like >=30)
//  - rating (ops like >=4.5)
router.get('/search', async (req, res) => {
  try {
    const q = {};

    // title partial
    if (req.query.title) {
      q.title = { $regex: req.query.title, $options: 'i' };
    }

    if (req.query.cuisine) {
      q.cuisine = { $regex: req.query.cuisine, $options: 'i' };
    }

    // rating
    if (req.query.rating) {
      const parsed = parseOpValue(req.query.rating);
      if (parsed) {
        q.rating = typeof parsed.op === 'string' && parsed.op === '=' ? parsed.val : opToMongo(parsed.op, parsed.val);
      }
    }

    // total_time numeric filter
    if (req.query.total_time) {
      const parsed = parseOpValue(req.query.total_time);
      if (parsed) {
        q.total_time = typeof parsed.op === 'string' && parsed.op === '=' ? parsed.val : opToMongo(parsed.op, parsed.val);
      }
    }

    // calories filter — uses calories_num field
    if (req.query.calories) {
      // accept formats like <=400, >=200, =350, 400
      const parsed = parseOpValue(req.query.calories);
      if (parsed) {
        q.calories_num = (parsed.op === '=') ? parsed.val : opToMongo(parsed.op, parsed.val);
      }
    }

    // Pagination for search (optional)
    let page = Math.max(1, parseInt(req.query.page || '1'));
    let limit = Math.max(1, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments(q);
    const data = await Recipe.find(q).sort({ rating: -1 }).skip(skip).limit(limit).select('-__v');

    res.json({ page, limit, total, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
