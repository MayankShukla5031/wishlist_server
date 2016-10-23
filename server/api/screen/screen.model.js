'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var ScreenSchema = new Schema({
    name: String,
    mallName: String,
    geo: [],
    city: String,
    createdAt: Date,
    updatedAt: Date
});

//TODO: Add index fields
var indexFields = [
];
indexFields.forEach(function(field) {
    var fields = {};
    fields[field] = 1;
    ScreenSchema.index(fields, {background:true});
});

module.exports = mongoose.model('Screen', ScreenSchema);