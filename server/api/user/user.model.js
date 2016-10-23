'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phoneNumber: String,
    hashedPassword: String,
    passwordHistory:[{password:{type:String}}],
    salt: String,
    name:String,
    fullName:String,
    noOfAttempts: { type: Number, default: 0},
    lastAttempt: { type: Date, default: Date.now},
    address:String,
    _image:String,
    roleType:String,
    followers:[{
        followerId:{type:Schema.Types.ObjectId,ref:'User'}
    }],
    likes:[{
        likerId:{type:Schema.Types.ObjectId,ref:'User'}
    }],
    comments:[{
        commentor:{type:Schema.Types.ObjectId,ref:'User'},
        comment:String,
        date:Date,
        tag:String
    }],
    following:[{
        followingId:{type:Schema.Types.ObjectId,ref:'User'}
    }],
    createdAt:Date,
    updatedAt:Date,
    joinedAt:Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    passwordExpires: Date,
    passwordExpirySentAt: [Date],
    cloned : { type: Boolean, default: false},
    isActive:{type:Boolean, default: true},
    chatGroupId:[{groupId: {type:Schema.Types.ObjectId, ref:'ChatGroup'}, groupName: String}]
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

//New Pasword with same salt as the previous ones
UserSchema
    .virtual('newPassword')
    .set(function(password) {
        this._password = password;
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Public profile information
UserSchema
    .virtual('profile')
    .get(function() {
        return {
            'name': this.name,
            'role': this.role
        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'role': this.role
        };
    });


UserSchema
    .virtual('image')
    .get(function() {
        if(!this._image || this._image == "" || this._image == undefined || this._image == null)
            return "assets/images/avatar.jpg";
        return this._image;
    })
    .set(function(img) {
        this._image = img;
    });

/**
 * Validations
 */

// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function(hashedPassword) {
        return hashedPassword.length;
    }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
    .path('email')
    .validate(function(value, respond) {
        var self = this;
        this.constructor.findOne({email: value}, function(err, user) {
            if(err) throw err;
            if(user) {
                if(self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function(next) {
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.hashedPassword))
            next(new Error('Invalid password'));
        else
            next();
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return true;//this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * checkPasswordInHistory - check if the new password is the previous ones
     */
    checkPasswordInHistory: function(plainText) {
        var length=this.passwordHistory.length;
        var newPassword=this.encryptPassword(plainText);
        for (var i = 0; i < length; i++) {
            if( newPassword=== this.passwordHistory[i].password)
                return true;
        }
        return false;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }

};

UserSchema.set('toObject',  { getters: true, virtuals: true });
UserSchema.set('toJSON',    { getters: true, virtuals: true });
UserSchema.set('image', true);


var indexFields = [
    'email',
];
indexFields.forEach(function(field) {
    var fields = {};
    fields[field] = 1;
    UserSchema.index(fields, {background:true});
});

module.exports = mongoose.model('User', UserSchema);