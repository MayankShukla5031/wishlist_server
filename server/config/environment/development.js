'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
         //uri: 'mongodb://localhost/movwish-dev'
        uri: 'mongodb://movwishAdmin:movwishAdmin@ds031852.mlab.com:31852/movwish'
    },
    host:'localhost',
    cluster:false
};
