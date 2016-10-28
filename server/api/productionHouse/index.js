'use strict';

var express = require('express');
var controller = require('./productionHouse.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',                controller.getProductionHouses);
router.post('/',               controller.addProductionHouse);
router.put('/:id',             controller.updateProductionHouse);

module.exports = router;
