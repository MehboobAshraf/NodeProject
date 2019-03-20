var express = require('express');
var controller = require('./result.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/list', controller.resultList);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
