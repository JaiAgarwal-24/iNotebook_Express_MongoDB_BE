const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Create a User using: POST "/auth/". Dosen't require Auth

router.post('/', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atlest 5 characters').isLength({ min: 5 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create(req.body)
    .then(user => res.json(user))
    .catch(err => {console.log(err)
    res.json({error: 'Please enter unique value for Email', message: err.message})})
})
module.exports = router;