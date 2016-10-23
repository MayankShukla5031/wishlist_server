'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var ProductionHouse = require('./productionHouse.model');
var async = require('async');

exports.getProductionHouses = function(req, res) {
    ProductionHouse.find({}, function(err, productionHouses) {
        if(err) return handleError(res, err);
        else res.json(200, productionHouses);
    });
};

exports.addProductionHouse = function(req, res) {
    ProductionHouse.create(req.body, function(err, productionHouse) {
        if (err) return handleError(res, err);
        return res.json(201, productionHouse);
    });
};

exports.updateProductionHouse = function(req, res) {
    ProductionHouse.findOne({_id:req.params.id}, function(err, productionHouse) {
        if(err) return handleError(res, err);
        var updatedProductionHouse = _.merge(productionHouse, req.body);
        updatedProductionHouse.save(function (err) {
            if(err) return handleError(res, err);
            return res.json(200, updatedProductionHouse);
        });
    });
};


function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}
