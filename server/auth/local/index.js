'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User = require('../../api/user/user.model');
var router = express.Router();

router.post('/', function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if(user)
            req.user=user;

        var error = err || info;
        if(error){
            //user was unable to login
            User.findOne({email: req.body.email},{_id:1},function(err,user){
                if(user) {
                    //user entered a wrong password
                    req.user = user;
                    return res.json(401, error);
                }
                else {
                    //user entered a wrong emailId
                    return res.json(401, error);
                }
            });
        }
        else if(!user){
            //there was no error still there was no user
            return res.json(404,{message: 'Something went wrong, please try again.'});
        }
        else {
            //user authenticated
            var token = auth.signToken(user._id, user.role);
            res.json({token: token});
        }
    })(req, res, next)
});

module.exports = router;
