const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const Product = require('../models/product');
const Order = require('../models/order');
// const { productSchema } = require('../schemas');
// const router = express.Router();

// import { protect, admin } from '../middleware/authMiddleware.js';



// POST request to add a product to an order
router.get('/', async (req, res) => {
    const user = req.user;
    res.json(user)

});

module.exports = router;
module.exports = router;
