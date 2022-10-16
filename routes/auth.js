const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Create a User using: POST "/auth/createuser". Dosen't require Auth

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atlest 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // If there are errors return basd Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // check weather the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry a user with this email already exists' })
        }
        // Create a new user
        user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured")
    }

})
module.exports = router;