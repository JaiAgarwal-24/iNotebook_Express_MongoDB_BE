const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Jaiwi11becom3gr3atc0d34";

// ROUTE 1: Create a User using: POST "/auth/createuser". Dosen't require Auth

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

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = secPassword;

        // Create a new user
        user = await User.create(req.body);
        console.log(user.id)

        const authtoken = jwt.sign(user.id, JWT_SECRET);
        console.log(authtoken);

        res.json({ authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }

})

// ROUTE 2: Authenticate a User using: POST "/auth/login". No Login required

router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct Credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct Credentials" });
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(payload, JWT_SECRET);
        console.log(authtoken);

        res.json({ authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }

})


// ROUTE 3: Get Logged in User Details: POST "/auth/getuser".Login required

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
})

module.exports = router;