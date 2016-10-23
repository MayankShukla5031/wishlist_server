'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Movie = require('./movie.model');
var async = require('async');

exports.getMovies = function(req, res) {
    Movie.find({}, function(err, movies) {
        if(err) return handleError(res, err);
        else res.json(200, movies);
    });
};

exports.addMovie = function(req, res) {
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


function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}
