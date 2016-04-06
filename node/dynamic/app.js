var http = require("http");
var url = require("url");
var qs = require("querystring");
var _urlMap;
var _postMap;


var server = http.createServer(function (request, response){
	var handle = function () {

        response.setHeader('Content-Type', 'text/plain');

        response.writeHead(200, 'Ok');

        response.end();

    };


    /**
     * get请求
     */
    var _urlMap;

    request.get = function (key) {

        if (!_urlMap) {

            urlMap = url.parse(request.url, true);

        }

        return urlMap.query[key];

    };


    /**
     * [if description]
     * post请求
     * @param  {[type]} request.method [description]
     * @return {[type]}                [description]
     */
    if (request.method === 'POST') {

        var _postData = '',

            _postMap = '';



        request.on('data', function (chunk) {

            _postData += chunk;

        }).on('end', function () {

            request.postData = _postData;
            console.log(_postData)
            request.post = function (key) {

                if (!_postMap) {

                    _postMap = qs.parse(_postData);

                }

                return _postMap[key];

            };

            handle();

        });

    } else {

        handle();

    }

});





server.listen(8888);