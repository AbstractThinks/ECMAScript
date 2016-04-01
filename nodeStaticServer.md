
https://cnodejs.org/topic/4f16442ccae1f4aa27001071

var url = require("url");
var pathname = url.parse(request.url).pathname;



<pre>
var http = require("http");

http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;

  response.writeHead(200, {"Content-Type": "text/plain"});

  response.write("Hello World");

  response.end();

}).listen(8888);
</pre>
