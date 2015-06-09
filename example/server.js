var Nocker = require('../');

Nocker.register([

    // HTML Example
    {
        method: 'GET',
        path: '/hello/:id',
        reply: function(params) {
            return '<!DOCTYPE HTML>\n' +
                '<html>' +
                '<body>hello ' + params.id + '</body>' +
                '</html>';
        },
        options:  {
            contentType: 'text/html',
        }
    },

    // JSON Example
    {
        method: 'GET',
        path: '/json/:id',
        reply: function(params, query, body) {
            return {
                hello: params.id
            }
        }
    },

]);

// Start server on port 7003
Nocker.start({delay: 500, port: 8080, auth: false}, function() {
  console.log("Server is listening on port " + this.port + '\n');
})
