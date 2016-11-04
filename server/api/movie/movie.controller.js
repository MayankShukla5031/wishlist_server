'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Movie = require('./movie.model');
var async = require('async');

var searchKeyMappings = {
    title: 'title',
    artist: 'cast.name',
    director: 'director.name',
    producer: 'producer.name',
    musicDirector: 'musicDirector.name',
    productionHouse: 'productionHouse.name',
};

exports.getMovies = function(req, res) {
    Movie.find({}, function(err, movies) {
        if(err) return handleError(res, err);
        else res.json(200, movies);
    });
};

exports.searchMovies = function(req, res) {
    Movie.find({$text:{$search:req.params.key}}, function(err, movies) {
        if(err) return handleError(res, err);
        else res.json(200, movies);
    });
};

exports.addMovie = function(req, res) {
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();
    Movie.create(req.body, function(err, movie) {
        if (err) return handleError(res, err);
        return res.json(201, movie);
    });
};

exports.updateMovie = function(req, res) {
    Movie.findOne({_id:req.params.id}, function(err, movie) {
        if(err) return handleError(res, err);
        var updatedMovie = _.merge(movie, req.body);
        updatedMovie.save(function (err) {
            if(err) return handleError(res, err);
            return res.json(200, updatedMovie);
        });
    });
};
exports.addToWishList = function(req, res) {
    Movie.update({_id:req.params.movieId}, {$addToSet:{wish:{userId:req.user._id}}},function(err, movie) {
        if(err) return handleError(res, err);
        return res.json(200);
    });
};

exports.removeFromWishlist = function(req, res) {
    Movie.update({_id:req.params.movieId}, {$pull:{wish:{userId:req.user._id}}},function(err, movie) {
        if(err) return handleError(res, err);
        return res.json(200);
    });
};

exports.getTrending = function(req, res) {
    var projectObj = {title:1, release:1, cast:1, director:1, producer:1,
        musicDirector:1, productionHouse:1, posterUrl:1, wish:1, createdAt:1, updatedAt:1,
        wishCount: {$size: { "$ifNull": [ "$wish", [] ] } }};
    var sortObj= {wishCount: -1};
    Movie.aggregate([
        {$project:  projectObj},
        {$sort:     sortObj}
    ]).exec(function(err, movies) {
        if(err) return handleError(res, err);
        else res.json(200, movies);
    });
};

exports.getMyWishlist = function(req, res) {
    Movie.find({'wish.userId':req.user._id}, function(err, movies) {
        if(err) return handleError(res, err);
        else res.json(200, movies);
    });
};


function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}
