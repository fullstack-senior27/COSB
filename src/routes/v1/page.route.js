const express = require('express');
const { pageController } = require('../../controllers');

const router = express.Router();

router.route('/all').get(pageController.getAllPages);
router.route('/:key').get(pageController.getPageByKey);

module.exports = router