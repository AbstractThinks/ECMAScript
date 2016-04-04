var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("./mime").types;
var config = require("./config");
var zlib = require("zlib");

http.createServer(function(request, response) {
  /**
   * [pathname description]
   * 例： localhost:8888/index/app
   * 	  pathname = /index/app
   * @type {[type]}
   */
  var pathname = url.parse(request.url).pathname;
  if (pathname.slice(-1) === "/") {
        pathname = pathname + config.Welcome.file;
   }
  /**
   * path.normalize处理安全等问题
   * /../app.js会被替换掉为//app.js
   * 
   */
  var realPath = path.join("source", path.normalize(pathname.replace(/\.\./g, "")));



  fs.exists(realPath, function(exists) {
  	if (!exists) {

		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.write("This request URL "+ realPath +" was not found on this server.");
		response.end();

  	} else {
		/**
		* [ext description]
		* 例： localhost:8888/index.html
		* 	  path.extname(pathname) = .html;
		* @type {[type]}
		*/
		var type = path.extname(pathname);
		type = type ? type.slice(1) : 'unknown';
		var contentType = mime[type] || "text/plain";


  		fs.stat(realPath, function (err, stat) {

		    var lastModified = stat.mtime.toUTCString();
		    var ifModifiedSince = "If-Modified-Since".toLowerCase();
		    response.setHeader("Last-Modified", lastModified);

		    //缓存头部信息
		    if (type.match(config.Expires.fileMatch)) {

			    var expires = new Date();
			    expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
			    response.setHeader("Expires", expires.toUTCString());
			    response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);

			}

			if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                
                response.writeHead(304, "Not Modified");
                response.end();

            } else {

            	fs.readFile(realPath, "binary", function(err, file){

		  			if (err) {

		  				response.writeHead(500, {'Content-Type': 'text/plain'});
		                response.end(err);

		  			} else {
		  				response.setHeader("Server", "Node/V5");
		  				response.writeHead(200, {'Content-Type': contentType});
		  				//gzip传输模式
		  				var raw = fs.createReadStream(realPath);
		  				var acceptEncoding = request.headers['accept-encoding'] || "";
		  				var matched = type.match(config.Compress.match);

		  				if (matched && acceptEncoding.match(/\bgzip\b/)) {

	                        response.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});
	                        raw.pipe(zlib.createGzip()).pipe(response);

	                    } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {

	                    	response.writeHead(200, {'Content-Type': contentType});
	                        response.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});
	                        raw.pipe(zlib.createDeflate()).pipe(response);

	                    } else {

	                        response.writeHead(200, "Ok");
	                        raw.pipe(response);

	                    }

		  				// 二进制传输模式
		  				// response.writeHead(200, {'Content-Type': contentType});
		      //           response.write(file, "binary");
		      //           response.end();

		  			}
		  		});

            }

		});
  		
  	}
  });

}).listen(8888);
