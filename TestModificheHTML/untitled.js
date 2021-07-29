var http = require('http');

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Ciao a tutti, sono un web server!');
});

server.listen(8080);
