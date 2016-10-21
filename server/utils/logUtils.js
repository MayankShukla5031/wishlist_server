'use strict';
var geoip = require('geoip-lite');

exports.getDeviceType = function(req) {
    var userAgent = req.headers['user-agent'];
    var deviceType;
    if( userAgent.match(/Android/i))
        deviceType='android';
    else if( userAgent.match(/iPhone|iPad|iPod/i))
        deviceType='ios';
    else
        deviceType='web';
    return deviceType;
};

exports.getIP = function(req) {
    var ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    return ip;
};

exports.getGeo = function(req) {
    var ip = exports.getIP(req);
    var geo = geoip.lookup(ip);
    if(!geo){
        return '';
    }
    var geoStr = geo.country + ', ' + geo.city;

    return geoStr;
};
