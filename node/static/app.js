var http = require("http");
var url = require("url");

http.createServer(function(request, response) {
  
  var pathname = url.parse(request.url).pathname;
  var realPath = "assets" + pathname;
  
  response.writeHead(200, {"Content-Type": "text/plain"});

  response.write("Hello World");

  response.end();

}).listen(8888);
