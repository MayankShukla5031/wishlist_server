'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Show = require('./show.model');
var async = require('async');

exports.getShows = function(req, res) {
    Show.find({isActive: true}, function(err, shows) {
        if(err) return handleError(res, err);
        else res.json(200, shows);
    });
};

exports.addShow = function(req, res) {
    Show.create(req.body, function(err, show) {
        if (err) return handleError(res, err);
        return res.json(201, show);
    });
};

exports.updateShow = function(req, res) {
    Show.findOne({_id:req.params.showId, isActive: true}, function(err, show) {
        if(err) return handleError(res, err);
        var updatedShow = _.merge(show, req.body);
        updatedShow.save(function (err) {
            if(err) return handleError(res, err);
            return res.json(200, updatedShow);
        });
    });
};

exports.getUpcoming = function(req, res) {
    Show.find({showTime:{$gte:new Date()}, isActive: true}, function(err, shows) {
        if(err) return handleError(res, err);
        else res.json(200, shows);
    });
};

exports.cancelShow = function(req, res) {
    Show.update({_id:req.params.showId, isActive: true}, {isActive: false}, function(err, show) {
        if(err) return handleError(res, err);
        else res.json(200, true);
    });
};


function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}
