'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var MovieSchema = new Schema({
    title: String,
    release:{ type : Date, default: Date.now },
    cast: [{castId:{type:Schema.Types.ObjectId,ref:'Artist'}, name: String}],
    director: [{directorId:{type:Schema.Types.ObjectId,ref:'Artist'}, name: String}],
    producer: [{producerId:{type:Schema.Types.ObjectId,ref:'Artist'}, name: String}],
    musicDirector: [{directorId:{type:Schema.Types.ObjectId,ref:'Artist'}, name: String}],
    productionHouse: [{productionHouseId: {type:Schema.Types.ObjectId,ref:'ProductionHouse'}, name:String}],
    posterUrl: { type : String, default: "" },
    wish:[{userId:{type:Schema.Types.ObjectId,ref:'User'}}],
    createdAt: Date,
    updatedAt: Date
});

//TODO: Add index fields
var indexFields = [
];
indexFields.forEach(function(field) {
    var fields = {};
    fields[field] = 1;
    MovieSchema.index(fields, {background:true});
});

MovieSchema.index({'title':'text',
    'cast.name':'text',
    'director.name':'text',
    'producer.name':'text',
    'musicDirector.name':'text',
});

module.exports = mongoose.model('Movie', MovieSchema);