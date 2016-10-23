'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var ArtistSchema = new Schema({
    name: String,
    dob: {type:Date, default:Date.now},
    tags: {type:Array, default:[]},
    image: String,
    skill: String, //acting, directing, musicDirecting, fights, producing
    gender: String,
    createdAt:Date,
    updatedAt:Date
});

//TODO: Add index fields
var indexFields = [
];
indexFields.forEach(function(field) {
    var fields = {};
    fields[field] = 1;
    ArtistSchema.index(fields, {background:true});
});

module.exports = mongoose.model('Artist', ArtistSchema);