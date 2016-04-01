每一个node.js执行文件，都自动创建一个module对象

module.exports的初始化值为{};

module.exports = {};

<a href="./node/exports/1">测试代码</a>

exports是对引用 module.exports的值

真正导出的执行是module.exports，而不是exports

export.js
<pre>
 exports.a = 1 
 module.exports = {a: 2}
</pre>

import.js
<pre>
  var x = require('./foo');
  console.log(x.a)          //2
</pre>

<a href="./node/exports/2">测试代码</a>

js函数既是对象，而module.export导出的函数只能调用其静态方法,不能调用其私有方法(prototype属性下的方法)

export.js
<pre>
function a(){

}
 
a.prototype.test = function(){
 console.log('test')
}

a.test1 = function(){
console.log('test1')
}
module.exports = a
</pre>
 
 import.js
 <pre>
 var x = require('./export');
 console.log(x) //{ [Function: a] test1: [Function] }
 console.log(x.test) //undefined
 console.log(x.test1) //[Function]
 x.test1() //test1
 </pre>
<a href="./node/exports/3">测试代码</a>
<h3>总结</h3>

<pre>
exports = module.exports = 对象;
exports.a = a
</pre>
