const express = require('express');
const { getCRM, updateCRM } = require('../controllers/crmController');

const router = express.Router();

router.get('/', getCRM);
router.put('/:id', updateCRM);

module.exports = router;
