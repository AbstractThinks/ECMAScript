Connect 是Node.js中的一个模块，可以用来创建中间件的一个框架，它自身已经包装了Node的HTTP模块的Server以及Server的req和res的对象


<pre>
var connect = require('connect');
var http = require('http');
	var app = connect()
	    .use(fn1)
	    .use(fn2);
	function fn1(req,res,next){
	        console.log("fn1");
	        next();
	}
	 
	function fn2(req,res){
	    res.writeHead(200,{'Connect-Type':'text/plain'});
	    res.end('it is connect test');
	}
	http.Server(app).listen(3000);
	</pre>
