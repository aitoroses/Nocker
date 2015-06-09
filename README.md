# Nocker

> A module for generating fast mocked REST service servers.

Could also be used for production services, but that's not the objective.

## Install

```npm install nocker```

## Usage

```js
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
```
## Liscense

Nocker is governed under the MIT License (MIT)

Copyright (c) 2015 Aitor Oses.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author

Aitor Oses
