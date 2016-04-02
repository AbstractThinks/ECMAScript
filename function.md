js函数声明，在函数中都会含有一个构造方法


a()相当于
<pre>
a.call(null);
</pre>

new a()相当于
<pre>
var obj = {};

obj.__proto__ = a.prototype;

a.call(obj);

return obj;
</pre>

