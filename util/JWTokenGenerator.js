var jwt = require('jsonwebtoken');
var moment = require('moment')
var debug = require('logdown')({prefix: 'JWTTokenGen'})

var SIGN_BASE64 = "N++/vXLvv71F77+9Ge+/vX8J77+9Ni1i77+977+9Ku+/vU3vv73vv70/77+9B0AH77+91Yhe77+9";
var SIGN = (new Buffer(SIGN_BASE64, 'base64')).toString('UTF-8');

module.exports = function(sub, payload, expirationMins) {

  var exp = moment().add(expirationMins, 'minutes');

  var newPayload = Object.assign(payload, {
    "sub": sub,
    "exp": exp.unix()
  })

  debug.info("Generated Payload for user " + sub + ":\n" + JSON.stringify(newPayload, null, '  '))

  return jwt.sign(newPayload, SIGN);
}
