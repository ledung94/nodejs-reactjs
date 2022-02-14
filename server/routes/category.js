const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Category = require('../models/Category');

// @route POST api/category/add
// @desc Add new category
// @access Public
router.post('/add', verifyToken, async (req, res) => {
    const { name, description } = req.body;

    if (!name)
        return res
            .status(400)
            .json({ success: false, message: 'Name is required' });

    try {
        const category = await Category.findOne({ name });

        if (category)
            return res.status(400).json({ success: false, message: 'Can not add an existed category!' });

        const newCategory = new Category({
            name: name,
            description: description
        });

        await newCategory.save();

        res.json({ success: true, message: 'Add a category successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
 
});

// @route GET api/category/categoryId
// @desc View list item of category
// @access Public
router.get('')

module.exports = router;