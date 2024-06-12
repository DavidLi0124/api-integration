const express = require('express');
const { getData, addData } = require('../controllers/dataController');

const router = express.Router();

router.get('/', getData);
router.post('/', addData);

module.exports = router;

