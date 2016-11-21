'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip:       process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

    // Server port
    host:'150.129.116.183',
    port:     process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    9000,

    // Cluster mode
    cluster: false,

    // MongoDB connection options
    mongo: {
        uri:    process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
        'mongodb://movwishAdmin:movwishAdmin@ds031852.mlab.com:31852/movwish'
    },
};
