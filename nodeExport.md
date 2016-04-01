每一个node.js执行文件，都自动创建一个module对象
module.exports的初始化值为{};
module.exports = {};

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
 var x = require('./foo');
 console.log(x) //{ [Function: a] test1: [Function] }
 console.log(x.test) //undefined
 console.log(x.test1) //[Function]
 x.test1() //test1
 </pre>

## 总结

<pre>
exports = module.exports = 对象;
exports.a = a
</pre>
