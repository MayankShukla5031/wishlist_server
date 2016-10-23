'use strict';

var express = require('express');
var controller = require('./productionHouse.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',             isAuth(),   controller.getProductionHouses);
router.post('/',            isAuth(),   controller.addProductionHouse);
router.put('/:id',          isAuth(),   controller.updateProductionHouse);

module.exports = router;
