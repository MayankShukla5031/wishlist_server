'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Artist = require('./artist.model');
var async = require('async');

exports.getArtists = function(req, res) {
    var projectionObj={};
    if(req.query.select){
        var select=JSON.parse(req.query.select);
        select.forEach(function(field){
            projectionObj[field]=1;
        });
    }
    Artist.find({},projectionObj,  function(err, srtists) {
        if(err) return handleError(res, err);
        else res.json(200, srtists);
    });
};

exports.addArtist = function(req, res) {
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();
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
