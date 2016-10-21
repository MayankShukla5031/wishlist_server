var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var _ = require('lodash');
var mongoose=require('mongoose');
var User = require('../../api/user/user.model');
var UserController = require('../../api/user/user.controller');
var config = require('../../config/environment');
var authParameters = require('../../config/auth.config.js');
exports.setup = function (User, config) {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) return done(err);
                if (!user)
                    return done(null, false, { message: 'This login ID is not registered.' });
                else if (!user.isActive)
                    return done(null, false, { message: 'This login ID is Deactivated.' });
                else if (!user.authenticate(password)){
                    var interval= authParameters.NUM_ATTEMPTS_TIMEFRAME*1000*60*60*24;//milliseconds to 24 hours
                    var attempsAllowed= authParameters.NUM_ATTEMPTS_ALLOWED;
                    var currentTime=Date.now();
                    var lastTime=user.lastAttempt;
                    var failedAttempts=0;
                    user.lastAttempt=currentTime;
                    user.save(function(err) {
                        if (err) console.log("error happened");
                    });
                    if(currentTime-lastTime>=interval)
                        failedAttempts=1;
                    else
                        failedAttempts=user.noOfAttempts+1;
                    user.noOfAttempts=failedAttempts;
                    user.save(function(err) {
                        if (err)
                            console.log("error happened during updating no.");
                    });

                    if(failedAttempts==attempsAllowed-1)
                        return done(null, false, { message: 'You have one more attempt left' });
//initiating the forget password procedure
                    else if(failedAttempts>=attempsAllowed){
                        var url=config.host+":"+config.port;
                        UserController.sendNewPassword(user.email,url);
                        return done(null, false, { message: '603' });//status message to show max attempts
                    }
                    else
                        return done(null, false, { message: 'This password is not correct.' });
                }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
