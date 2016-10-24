'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var MovieSchema = new Schema({
    title: String,
    release:{ type : Date, default: Date.now },
    cast: [{artistId:{type:Schema.Types.ObjectId,ref:'Artist'}}],
    director: [{directorId:{type:Schema.Types.ObjectId,ref:'Artist'}}],
    producer: [{producerId:{type:Schema.Types.ObjectId,ref:'Artist'}}],
    musicDirector: [{directorId:{type:Schema.Types.ObjectId,ref:'Director'}}],
    productionHouse: [{productionHouseId:{type:Schema.Types.ObjectId,ref:'ProductionHouse'}}],
    posterUrl: { type : String, default: "" },
    inMyWishList: Boolean,
    wish:[{userId:{type:Schema.Types.ObjectId,ref:'User'}}],
    createdAt:Date,
    updatedAt:Date
});

//TODO: Add index fields
var indexFields = [
];
indexFields.forEach(function(field) {
    var fields = {};
    fields[field] = 1;
    MovieSchema.index(fields, {background:true});
});

module.exports = mongoose.model('Movie', MovieSchema);