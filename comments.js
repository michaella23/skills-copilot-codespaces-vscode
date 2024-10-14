// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');

var comments = [];
var server = http.createServer(function(request, response) {
  var urlParts = url.parse(request.url);
  if (urlParts.pathname === '/') {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.end(fs.readFileSync('index.html'));
  } else if (urlParts.pathname === '/comment') {
    if (request.method === 'POST') {
      var body = '';
      request.on('data', function(chunk) {
        body += chunk.toString();
      });
      request.on('end', function() {
        var comment = qs.parse(body);
        comments.push(comment.comment);
        response.writeHead(302, {
          'Location': '/'
        });
        response.end();
      });
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/json'
      });
      response.end(JSON.stringify(comments));
    }
  } else {
    var filePath = path.join(__dirname, urlParts.pathname);
    if (fs.existsSync(filePath)) {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(fs.readFileSync(filePath));
    } else {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      response.end('404 Not Found\n');
    }
  }
});

server.listen(3000);
console.log('Server running at http://localhost:3000/');