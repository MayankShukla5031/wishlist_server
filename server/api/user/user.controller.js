'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('./user.model');
var config = require('../../config/environment');
var authParameters = require('../../config/auth.config.js');
var jwt = require('jsonwebtoken');
var auth = require('../../auth/auth.service');
var async = require('async');
var fs = require('fs');

/**
 * Get list of users
 * @param  {object}   req
 * @param  {object}   res
 * @return {JSON}
 */
exports.index = function(req, res) {
    User.find({isActive:true,systemRole:{$ne:'pvAdmin'}}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};

exports.getAllUsers=function(req, res){
    var projectionObj={salt:0,hashedPassword:0};
    if(req.query.select){
        var select=JSON.parse(req.query.select);
        projectionObj={};
        select.forEach(function(field){
            projectionObj[field]=1;
        });
    }
    var queryObj = {systemRole:{$ne:'pvAdmin'},isActive:true};
    if(req.query.subset) {
        var subset=JSON.parse(req.query.subset);
        queryObj[subset[0]] = mongoose.Types.ObjectId(subset[1]);
    }
    console.log(queryObj, projectionObj);
    User.find(queryObj,projectionObj,function(err,users){
        if(err) return handleError(res,err);
        return res.send(users);
    });
};


/**
 * Change a users password
 * @param  {object}   req
 * @param  {object}   res
 * @param  {nextObjet} next
 * @return {JSON}
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);
    User.findById(userId, function(err, user) {
        if (user.authenticate(oldPass)) {
            changePassword(user,newPass,function(status){
                res.send(status);});

        } else {
            res.send(403);
        }
    });
};

var changePassword=function(user, newPass, callback){
    var passwordexpires = new Date().getTime()+(authParameters.PASSWORD_EXPIRES_IN_MONTHS*30*24*60*60*1000);
    var count = user.passwordHistory.length;
    var passwordExists=false;
    if(count>0)
        passwordExists=user.checkPasswordInHistory(newPass);
    if(!passwordExists) {
        //if the user is logging for the first time
        if(count==0)
            user.password = newPass;
        else
            user.newPassword = newPass;
        user.passwordExpires = passwordexpires;
        user.save(function (err) {
            if (err) return validationError(res, err);
            // If password history is 'full' remove an old one and push the new one
            if (count == authParameters.PASSWORD_HISTORY_UPTILL)
                user.passwordHistory.shift();
            user.passwordHistory.push({password: user.hashedPassword});
            user.save(function (err) {
                if (err) return validationError(res, err);
                return callback(200);
            });
            //return callback(200);
        });
    }
    else{
        return callback(600);
    }
};

/**
 * Updates an existing user in the DB.
 * @param  {object}   req
 * @param  {object}   res
 * @return {JSON}
 */
exports.updateUser = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return handleError(res, err);
        }
        if (!user) {
            return res.send(404);
        }
        var updated = _.merge(user, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, user);
        });
    });
};

/**
 * Get my info
 * @param  {object}   req
 * @param  {object}   res
 * @return {JSON}
 */
exports.getCurrentUser = function(req, res, next){
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword -passwordHistory').exec(function(err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        //res.json(user);
        res.send(user);
    });
};


/*Deactivate exisiting user
 * @param  {object}   req
 * @param  {object}   res
 * @return {JSON}
 */
exports.deactivateUser = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return handleError(res, err);
        }
        if (!user) {
            return res.send(404);
        }
        if (user.isActive) {
            user.isActive = false
            //user.email = user.email + "-deActivated" + new Date().getTime()
            user.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                var logs = socket.getLogs();
                var action = {actionType:'Deactivated User', dataType: 'Users', logs: logs};
                action['custom'] = {};
                action.custom.affectedUser = user.email;
                return res.json(200, user);
            });
        } else {
            res.json(200, user);
        }
    });
};

/*Reactivate exisiting user
 * @param  {object}   req
 * @param  {object}   res
 * @return {JSON}
 */
exports.reactivateUser = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return handleError(res, err);
        }
        if (!user) {
            return res.send(404);
        }
        if (!user.isActive) {
            user.isActive = true
            user.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                var logs = socket.getLogs();
                var action = {actionType:'Reactivated User', dataType: 'Users', logs: logs};
                action['custom'] = {};
                action.custom.affectedUser = user.email;
                return res.json(200, user);
            });
        } else {
            return res.json(200, user);
        }
    });
};
//Function to update profile picture of the user
exports.addImage = function(req, res) {
    fs.readFile(req.files.file.path, function(err, data) {
        var imageName = req.files.file.name;
        if (!imageName) {
            res.end();
        } else {
            var dir = config.root + "/../../uploads/peersview/" + req.body.userId;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 777);
                var photoDir = dir + "/photo"
                fs.mkdirSync(photoDir, 777);
            }
            var newPath = dir + "/photo/" + imageName;
            var image_path = {image: "uploads/wishlist/" + req.body.userId + "/photo/" + imageName};
            fs.writeFile(newPath, data, function(err) {
                if(err) console.log("error in writeFile:", err);
                User.update({_id: mongoose.Types.ObjectId(req.body.userId)}, {
                    $set: {_image: image_path.image}
                }, function(err, user) {
                    if (err) console.log("error in user image update:", err);

                    if (user) {
                        return res.send(200, image_path);
                    }
                });
            });
        }
    });
};


// Authentication callback
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/*To handle forgot password
 * @param  {object}   res
 * @param  {object}   err
 * @param  {object}   next
 * @return {JSON}
 */
exports.forgotPassword = function(req, res, next) {
    forgotPassword(req.body.email,req.headers.host,res,next);
};

var forgotPassword = function(email,host,response,next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (!user && response!=null) {
                    // req.flash('error', 'No account with that email address exists.');
                    return response.json({
                        message: "Failed"
                    });
                    // return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + (authParameters.RESET_TOKEN_EXPIRES_IN_HOURS * 60 * 60 * 1000); // 1 hour

                user.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var options = {
                about: response? mailer.about.FORGOT_PASSWORD : mailer.about.MAX_ATTEMPTS_CROSSED,
                to: user.userEmail,
                extras: {
                    host: host,
                    token: token
                }
            };
            mailer.sendMail (options, done);
        }
    ], function(err) {
        if (err) {
            console.log("Error : " + err);
            return next(err)
        };
        if(response!=null){
            response.redirect('/forgot');}
    });
};
module.exports.sendNewPassword = forgotPassword;
/*reset password functionality
 * @param  {object}   res
 * @param  {object}   err
 * @return {JSON}
 */
exports.resetPassword = function(req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!user) {
            // req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.user
        });
    });
};
/*Reset password confirmation
 * @param  {object}   res
 * @param  {object}   err
 * @return {JSON}
 */
exports.resetPasswordConfirm = function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (!user) {
                    console.log("Password reset token is invalid or has expired.")
                    return res.json({
                        message: 602
                    });//Password reset token is invalid or has expired
                }

                changePassword(user, req.body.password, function(status) {
                    UserActionController.updateUserAction(req, 'Attempted password reset', {affectedUser: user.email, status: status});
                    if (status != 200)
                        return res.json({
                            message: status
                        });
                    else {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save(function (err) {
                            if (err) {
                                done (err);
                            }
                            req.logIn(user, function (err) {
                                if (!err) {
                                    console.log("Success ! Logging in.")
                                    done(null, user);
                                    return res.json({
                                        message: 200
                                    });
                                } else {
                                    console.log("Fail ! Logging in.");
                                    return res.json({
                                        message: 601
                                    });//user found but some error occured
                                }
                            });
                        });
                    }

                });


            });
        },
        function(user, done) {
            console.log("Sending confimation mail to your email id.")
            var mailOptions = {
                about: mailer.about.RESET_PASSWORD_CONFIRM,
                to: user.userEmail
            };
            mailer.sendMail(mailOptions, done);
        }
    ], function(err) {
        if (err) {
            console.log("Redirecting to homepage...");
            res.redirect('/');
        }
    });
};

exports.createUser = function (req, res) {
    User.findOne({email:req.body.email},function(err, oldUsr) {
        if(err) handleError(req, err);
        if(!oldUsr){
            User.create({email:req.body.email, name: req.body.name, password: req.body.password},function (err, user) {
                if(err) handleError(req, err);
                res.json(200, user);
            });
        } else{ res.json(200, user);}
    });
};
/*Return all users with populated roles, jobroles and branch information
 * @param  {object}   res
 * @param  {object}   err
 * @return {JSON}
 */
exports.getUserImage = function(req,res){
    User.findOne({_id:req.params.userId},{image:1}).exec(function(err,user){
        if(err){console.log('Error : ', err); res.send(500,err);}
        res.send(200,user.image);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}

/**
 * Check for validation error
 *
 * @param  {object}   res
 * @param  {object}   err
 * @return {JSON}
 */
function validationError(res, err) {
    return res.json(422, err);
};
