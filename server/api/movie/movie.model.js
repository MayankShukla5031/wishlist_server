'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var MovieSchema = new Schema({
    title: String,
    release:{ type : Date, default: Date.now },
    cast: [{artistId:{type:Schema.Types.ObjectId,ref:'Artist'}, name: String}],
    directors: [{directorId:{type:Schema.Types.ObjectId,ref:'Artist'}, name: String}],
    producers: [{producerId:{type:Schema.Types.ObjectId,ref:'Artist'}, name: String}],
    musicDirectors: [{directorId:{type:Schema.Types.ObjectId,ref:'Director'}, name: String}],
    productionHouse: {_id: {type:Schema.Types.ObjectId,ref:'ProductionHouse'}, name:String},
    posterUrl: { type : String, default: "" },
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

var textIndexFields = {
    'title':'text',
    'cast.name':'text',
    'director.name':'text',
    'producer.name':'text',
    'musicDirector.name':'text',
    'productionHouse.name':'text'
};
MovieSchema.index(textIndexFields);

module.exports = mongoose.model('Movie', MovieSchema);