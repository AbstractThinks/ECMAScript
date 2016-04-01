#get请求
<pre>
var http = require('http');
var url = require("url");
http.createServer(function (req, res)

    var params = url.parse(req.url, true).query;//解释url参数部分name=zzl&email=zzl@sina.com

    res.write(info);
    res.end();
}).listen(8000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8000/');
</pre>

#post请求
<pre>
var http = require('http');
var url = require("url");
var querystring = require("querystring");
http.createServer(function (req, res) {
    // 设置接收数据编码格式为 UTF-8
    req.setEncoding('utf-8');
    var postData = ""; 
    
    
    // 数据块接收中
    req.on("data", function (chunk) {
        post += chunk;
    });
    
    
    // 数据接收完毕，执行回调函数
    req.on("end", function () {
        console.log('数据接收完毕');
        var params = querystring.parse(postData); //解释表单数据部分{name="zzl",email="zzl@sina.com"}
    });
    
    
}).listen(8000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8000/');
</pre>
