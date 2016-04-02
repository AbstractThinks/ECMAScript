js函数声明，在函数中都会含有一个构造方法


a()相当于a.call();

new a()相当于var obj = {};obj.__proto__ = Test.prototype;a.call(obj);


