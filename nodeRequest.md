#Get请求
<pre>

get.js

var http = require('http');
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("./mime").types;

http.createServer(function (req, res) {
    //获取参数信息
    var params = url.parse(req.url, true).query;  //解释url参数部分name=zzl&email=zzl@sina.com
    var pathname = url.parse(req.url).pathname;   //解释请求路径
    var realPath = "assets" + pathname;           //访问本服务assets文件夹下pathname路径
    
    //获取mime类型
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    var contentType = mime[ext] || "text/plain";
    
    //返回静态资源
    readFile(realPath, pathname, contentType)
    res.end();
    
}).listen(8000, "127.0.0.1");


var readFile = function (req, res, realPath, pathname, contentType) {

  var realPath = realPath;
  var pathname = pathname;
  var request = req;
  var response = res;
  
  path.exists(realPath, function (exists) {
        if (!exists) {

            response.writeHead(404, {'Content-Type': 'text/plain'});

            response.write("This request URL " + pathname + " was not found on this server.");

            response.end();

        } else {

            fs.readFile(realPath, "binary", function(err, file) {

                if (err) {

                    response.writeHead(500, {'Content-Type': 'text/plain'});

                    response.end(err);

                } else {
                
                    if (ext.match(config.Expires.fileMatch)) {

                        var expires = new Date();
                    
                        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                    
                        response.setHeader("Expires", expires.toUTCString());
                    
                        response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                    
                    }

                    response.writeHead(200, {'Content-Type': contentType});

                    response.write(file, "binary");

                    response.end();

                }

             });

          }

      });
}


MIME.js    //MIME类型支持
exports.types = {

  "css": "text/css",

  "gif": "image/gif",

  "html": "text/html",

  "ico": "image/x-icon",

  "jpeg": "image/jpeg",

  "jpg": "image/jpeg",

  "js": "text/javascript",

  "json": "application/json",

  "pdf": "application/pdf",

  "png": "image/png",

  "svg": "image/svg+xml",

  "swf": "application/x-shockwave-flash",

  "tiff": "image/tiff",

  "txt": "text/plain",

  "wav": "audio/x-wav",

  "wma": "audio/x-ms-wma",

  "wmv": "video/x-ms-wmv",

  "xml": "text/xml"

};

</pre>

#
