var dateFormat = require('dateformat');
var morgan = require('morgan');
var logUtils = require('../utils/logUtils.js');

var develop = morgan.format('develop', function(tokens, req, res){
    var status = res.statusCode;
    var statusColor = getStatusColor(status);

    var respTimeMS = (new Date - req._startTime);     // in ms
    var respTimeColor = getRespTimeColor(respTimeMS);
    var respTimeS = (respTimeMS * .001).toFixed(1);

    var now = new Date();
    var gmtHours = -now.getTimezoneOffset()/60;
    var timestamp = dateFormat(now, "mmm dd, HH:MM:ss")+" GMT+"+ gmtHours;
    var userInfo = req.user ? req.user.name + ', ' + req.user.systemRole + ', ' + req.user.email + ', ' : '';
    var deviceInfo = logUtils.getDeviceType(req);
    var userLoc = logUtils.getGeo(req) + ', ' + logUtils.getIP(req);
    var url = (req.originalUrl || req.url);

    var log = null;
    // log only '/api' requests
    if(url.substring(0, 4) == "/api") {
        log = gray + '[' + timestamp + ']: '
            + statusColor + res.statusCode + ', '
            + respTimeColor + respTimeS + defaultClr + gray + ' s: '
            + req.method + ' '
            + url.substring(4) + ': ['
            + userInfo + deviceInfo + ', ' + userLoc + ']';
    }
    return log;
});

var gray = '\x1b[90m', green = '\x1b[32m', red = '\x1b[31m', yellow = '\x1b[33m', cyan = '\x1b[36m', defaultClr = '\x1b[39m';

var getStatusColor = function(status) {
    var statusColor = gray;
    if (status >= 500) statusColor = red;
    else if (status >= 400) statusColor = yellow;
    //else if (status >= 300) statusColor = cyan;
    return statusColor;
};

var getRespTimeColor = function(respTime) {
    var respTimeColor = gray;
    if (respTime >= 1000) respTimeColor = red;
    else if (respTime >= 500) respTimeColor = yellow;
    return respTimeColor;
};