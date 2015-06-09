require('es6-shim');

var express = require('express');
var colors = require('colors');

var DEFAULT_OPTIONS = {
  delay: 500
}

// Middlewares
var multer  = require('multer')
var bodyParser = require('body-parser');
var JWT = require('./middleware/jwt');
var CORS = require('./middleware/cors');
var proxy = require('proxy-middleware');
var url = require('url');

/**
 * Nocker - description
 *
 * @param  {type} options description
 * @return {type}         description
 */
function Nocker(options) {
  console.log('\nInitializing Nocker...\n'.blue.bold);
  this.options = options || {};
  this.app = express();

  // Middlewares
  // this.app.use(CORS());
  this.app.use(JWT());
  this.app.use(bodyParser.json());
  this.app.use(multer({ dest: '../uploads/'}));
  this.app.use('/eAppAngular', proxy(url.parse('http://localhost:3000')));
}

Nocker.prototype.route = _request;

Nocker.prototype.get = function(path) {
  return _request.call(this, 'get', path);
}

Nocker.prototype.post = function(path) {
  return _request.call(this, 'post', path);
}

Nocker.prototype.listen = function(port, cb) {
  this.app.listen(port || this.options.port, cb);
}



/**
 * _request - Function that handles the route registering
 *
 * @param  {type} method description
 * @param  {type} path   description
 * @return {type}        description
 */
function _request(method, path) {
  console.log("Route: ".green.bold + method.toUpperCase().gray.bold + ' ' + path);
  var ctx = this;
  var route = this.app[method.toLowerCase()];
  // OPTIONS method
  var options = this.app.options(path, function(req, res) { res.end() });
  // Return an instance of a replier
  return {
    reply: function(response, opts) {

      var opts = opts || {};

      // RESPOND

      if(typeof response == "object" || typeof response == "string") {
        // In case of object
        route.call(ctx.app, path, function(req, res) {
          respond(req, res, response, opts);
        });
      }

      if(typeof response == "function") {
        var fn = response;
        route.call(ctx.app, path, function(req, res) {
          var context = {req: req, res: res};
          var result = fn.call(context, req.params, req.query, req.body);
          if (result) {
            respond(req, res, result, opts);
          } else {
            // Finalise the request
            res.end();
          }
        });
      }
    }
  }
}


/**
 * respond - Responding middleware
 *
 * @param  {type} req      middleware request
 * @param  {type} res      middleware response
 * @param  {type} response objects that handles the response
 * @param  {type} options  options object
 */
function respond(req, res, response, options) {

  function logRequest(req) {
    console.log(req.method.toUpperCase() + ' ' + req.url, req.params, req.query, req.body);
  }

  logRequest(req);

  // Respond with a delay
  setTimeout(function() {

    // Authorization
    if (options.auth && (options.requiresAuth != false)) {
      if(!req.authenticated) {
        res.statusCode = 401;
        res.set({"Content-Type": 'text/plain'});
        res.write("User has no access to this resource");
        res.end();
        return
      }
    }

    // Custom contentType
    if (options.contentType) {
      console.log("Answering contentType: " + options.contentType)
      res.set({"Content-Type": options.contentType});
      res.write(response);

    // Default action JSON
    } else {
      res.json(response);
      return;
    }

    res.end();

  }, options.delay);
};


/**
 * Singleton instance
 */
var instance = {
  routes: [], // {method, path, reply, options}
  register: function(routes) {
    instance.routes = instance.routes.concat(routes);
  },
  start: function(options, listenCb) {
    var nocker = new Nocker(options);
    instance.routes.forEach(function(route) {
      var routeOpts = Object.create({});
      Object.assign(routeOpts, options, route.options);
      nocker.route(route.method, route.path).reply(route.reply, routeOpts);
    });
    console.log("\nAll routes registered correctly.\n".blue.bold)
    nocker.listen(options.port, listenCb.bind(options));
  },
}

Nocker.register = instance.register;
Nocker.start = instance.start;

module.exports = Nocker;
