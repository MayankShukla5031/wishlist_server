'use strict';

var express = require('express');
var controller = require('./movie.controller');
var auth = require('../../auth/auth.service');
var isAuth = auth.isAuthenticated;
var router = express.Router();

router.get('/',                                        controller.getMovies);
router.get('/search',                                  controller.searchMovies); //Ex: api/movies/search?key='anything'
router.post('/',                                       controller.addMovie);
router.put('/:id',                                     controller.updateMovie);
router.put('/addToWishList/:movieId',                  controller.addToWishList);
router.put('/removeFromWishlist/:movieId',             controller.removeFromWishlist);
router.get('/trending',                                controller.getTrending);
router.get('/myWishList',                              controller.getMyWishlist);

module.exports = router;
