var jwt = require('jsonwebtoken');
var tokenGen = require('../util/JWTokenGenerator');
var moment = require('moment');
var debug = require('logdown')({prefix: "JWT middleware"});

// JWT middleware
module.exports = function() {
  return function JWT(req, res, next) {

    // Expose header
    // res.header({'Access-Control-Expose-Headers': "Authorization"})

    var header = req.get("Authorization");

    if (header) {
      header = header.split(" ");
    } else {
      req.authenticated = false;
      return next();
    }

    // Test for bearer
    if (/^Bearer$/.test(header[0])) {
      header = header[1];
    } else {
      header = header[0];
    }

    var token = new Buffer(header, 'base64').toString('UTF-8');

    // Do not verify the signature by now...
    var payload = jwt.decode(token);
    req.jwt = payload;

    // Check the expiration time;
    var expDate = moment.unix(payload.exp);
    var now = moment();
    var expired = expDate.isBefore(now);

    debug.info(`\n
      # Now     ${now.unix()}
      # Expires ${expDate.unix()}
    \n`);

    if (!expired) {
      debug.log('Expires: ' + expDate.fromNow())
    }

    debug.log("Request Auth: " + JSON.stringify(payload, null, '  '));

    // Set value to the request
    req.authenticated = !expired && payload.accessLevel > 0;

    if(req.authenticated) {
      // We obtain from the body the login and password
      // We have to generate a JWT token
      var token = tokenGen(req.jwt.sub, payload, 15);
      debug.log('JWT authorization token refreshed\n')

      // Compress to base64
      token = (new Buffer(token, 'UTF-8')).toString('base64');
      res.set({Authorization: 'Bearer ' + token});
    } else {
      debug.error(`Not authorized request. The token it's not valid or has expired ${expDate.fromNow()}\n`);
    }

    next();
  }
}
