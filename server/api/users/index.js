var express = require('express');
var controller = require('./users.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/login', controller.login);
router.get('/:id', controller.show);
router.post('/register', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
