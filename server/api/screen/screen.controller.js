'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Screen = require('./screen.model');
var async = require('async');

exports.getScreens = function(req, res) {
    Screen.find({}, function(err, screens) {
        if(err) return handleError(res, err);
        else res.json(200, screens);
    });
};

exports.addScreen = function(req, res) {
    Screen.create(req.body, function(err, screen) {
        if (err) return handleError(res, err);
        return res.json(201, screen);
    });
};

exports.updateScreen = function(req, res) {
    Screen.findOne({_id:req.params.id}, function(err, screen) {
        if(err) return handleError(res, err);
        var updatedScreen = _.merge(screen, req.body);
        updatedScreen.save(function (err) {
            if(err) return handleError(res, err);
            return res.json(200, updatedScreen);
        });
    });
};


function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}
