// routes/index.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');

router.post('/inquiry', controller.inquiry);
router.post('/payment', controller.payment);
router.get('/history', controller.history);
router.get('/', function (req, res) {
  res.render('index', { title: 'PDAM Transaction' });
});

module.exports = router;
