

'use strict';

var express = require('express');
var controller = require('./admin.controller');
var router = express.Router();

router.get('/*',                controller.getAdminPage);

module.exports = router;