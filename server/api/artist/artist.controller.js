'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Artist = require('./artist.model');
var async = require('async');

exports.getArtists = function(req, res) {
    Artist.find({}, function(err, srtists) {
        if(err) return handleError(res, err);
        else res.json(200, srtists);
    });
};

exports.addArtist = function(req, res) {
    Artist.create(req.body, function(err, srtist) {
        if (err) return handleError(res, err);
        return res.json(201, srtist);
    });
};

exports.updateArtist = function(req, res) {
    Artist.findOne({_id:req.params.id}, function(err, srtist) {
        if(err) return handleError(res, err);
        var updatedArtist = _.merge(srtist, req.body);
        updatedArtist.save(function (err) {
            if(err) return handleError(res, err);
            return res.json(200, updatedArtist);
        });
    });
};


function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}
