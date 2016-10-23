'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var ProductionHouseSchema = new Schema({
    name: String,
    dob: {type:Date, default:Date.now},
    tags: {type:Array, default:[]},
    image: String,
    createdAt:Date,
    updatedAt:Date
});

//TODO: Add index fields
var indexFields = [
];
indexFields.forEach(function(field) {
    var fields = {};
    fields[field] = 1;
    ProductionHouseSchema.index(fields, {background:true});
});

module.exports = mongoose.model('ProductionHouse', ProductionHouseSchema);