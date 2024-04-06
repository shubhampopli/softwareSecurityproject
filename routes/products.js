const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const Product = require('../models/product');
const { productSchema } = require('../schemas');
const { isLoggedIn ,Isadmin,isSeller} = require('../middleware');
const Joi = require('joi');


const validateProduct = (req, res, next) => {


    const  productSchema = Joi.object({
        product: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })

    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/',catchAsync( async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products })
}));
router.get('/new',isLoggedIn, (req, res) => {
    res.render('products/new');
})
router.post('/',validateProduct,  catchAsync(async (req, res, next) => {

    const product = new Product(req.body.product);
    // console.log(req.user);
    product.seller=req.user._id;
    await product.save();
    req.flash('success', 'Successfully listed a new product!');
    res.redirect(`/products/${product._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const product = await Product.findById(req.params.id).populate('seller');
    // console.log(product);
    if (!product) {
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/products');
    }
    res.render('products/show', { product });
}));
router.get('/:id/edit',isLoggedIn,isSeller, catchAsync( async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('products/edit', {product});
}))

router.put('/:id',validateProduct,  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product});
    req.flash('success', 'Successfully edited the product !');
    res.redirect(`/products/${product._id}`)
}));

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

module.exports = router;