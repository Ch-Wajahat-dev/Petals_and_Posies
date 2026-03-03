const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// POST /api/newsletter/subscribe
router.post('/subscribe', [
    body('email').isEmail().withMessage('Valid email required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    console.log(`Newsletter subscription: ${email}`);
    res.json({ message: 'Successfully subscribed to newsletter!' });
});

module.exports = router;
