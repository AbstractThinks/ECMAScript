js函数声明，在函数中都会含有一个构造方法

function a(){}
隐式声明a.prototype.constructor = function() {}

new a()会默认执行a的构造方法
a()相当于a.call();
new a()相当于var obj = {};obj.__proto__ = Test.prototype;a.call(obj);



a = {}不会含有构造方法,因此执行new a命令会报错。
