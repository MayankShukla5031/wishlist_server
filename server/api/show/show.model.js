'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var ShowSchema = new Schema({
    screen:[{screenId:{type:Schema.Types.ObjectId,ref:'Screen'}}],
    showTime:{type:Date, default:Date.now},
    ticketPrice:{type:Number, default:0},
    noOfSeats:{type:Number, default:0},
    minSeats: {type:Number, default:0},
    bookedUsers: [{userId:{type:Schema.Types.ObjectId,ref:'User'}}],
    movie: [{movieId:{type:Schema.Types.ObjectId,ref:'Movie'}}],
    isActive: Boolean,
    createdAt:Date,
    updatedAt:Date
});

//TODO: Add index fields
var indexFields = [
];
indexFields.forEach(function(field) {
    var fields = {};
    fields[field] = 1;
    ShowSchema.index(fields, {background:true});
});

module.exports = mongoose.model('Show', ShowSchema);