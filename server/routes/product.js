const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Product = require('../models/Product');

// @route POST api/product/add
// @desc Add new product
// @access Public
router.post('/add', verifyToken, async (req, res) => {
    const { name, description, price, url, quantity, category } = req.body;

    if (!name)
        return res
            .status(400)
            .json({ success: false, message: 'Name is required' });
    if (!price)
        return res
            .status(400)
            .json({ success: false, message: 'Price is required' });
    if (!url)
        return res
            .status(400)
            .json({ success: false, message: 'Url is required' });
    if (!quantity)
        return res
            .status(400)
            .json({ success: false, message: 'Quantity is required' });
    if (!category)
        return res
            .status(400)
            .json({ success: false, message: 'Category is required' });
    
    try {
        const product = await Product.findOne({ name: name, category: category });

        if (product)
            return res.status(400).json({ success: false, message: 'Can not add an existed product!' });

        const newProduct = new Product({
            name: name,
            description: description,
            price: price,
            url: url,
            quantity: quantity,
            category: category
        });

        await newProduct.save();

        res.json({ success: true, message: 'Add a product successfully', product: product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

// @route PUT api/product/update/:id
// @desc Update product
// @access Public
router.put('/update/:id', verifyToken, async (req, res) => {
    const { name, description, price, url, quantity, category } = req.body;

    if (!name)
        return res
            .status(400)
            .json({ success: false, message: 'Name is required' });
    if (!price)
        return res
            .status(400)
            .json({ success: false, message: 'Price is required' });
    if (!url)
        return res
            .status(400)
            .json({ success: false, message: 'Url is required' });
    if (!quantity)
        return res
            .status(400)
            .json({ success: false, message: 'Quantity is required' });
    if (!category)
        return res
            .status(400)
            .json({ success: false, message: 'Category is required' });
    
    try {
        let updatedProduct = {
            name: name,
            description: description,
            price: price,
            url: url,
            quantity: quantity,
            category: category
        };

        console.log(req.params.id);

        updatedProduct = await Product.findOneAndUpdate({ _id: req.params.id }, updatedProduct, { new: true });
        
        if (!updatedProduct)
          return res.status(400).json({
            success: false,
            message: "This product is not existed!",
          });

        res.json({
          success: true,
          message: "Updated this product successfully",
          product: updatedProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

// @route GET api/product/products
// @desc get all of products
// @access Public
router.get('/products', async (req, res) => {
    try {
      const products = await Product.find({}).populate("category", ['name']);
      //populate func: lets you reference documents in other collections
      return res.json({ success: true, products: products });
    } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
    }
})

// @route GET api/product/:id
// @desc get single product
// @access Public
router.get('/:id', async (req, res) => {
    try {
      const products = await Product.find({_id: req.params.id}).populate("category", ['name']);
      //populate func: lets you reference documents in other collections
      return res.json({ success: true, products: products });
    } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
    }
})

// @route DELETE api/product/delete/:id
// @desc delete product
// @access Public
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete({ _id: req.params.id });

        if (!deletedProduct) {
            return res.status(400).json({success: false, message: "Cannot delete this product or this product is not existed!"})
        }

        res.json({ success: true, message: "Deleted this product successfully!", product: deletedProduct });
    } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
    }
})


module.exports = router;