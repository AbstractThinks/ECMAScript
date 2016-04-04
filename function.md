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

<pre>
function myObject(msg){
     //特权属性(公有属性)
     this.myMsg = msg; //只在被实例化后的实例中可调用
     
     //私有属性
     var name = '豪情';
     
     //私有方法
     function sayName(){
         alert(that.name);
     }
     
     //这个方法每次实例化都要重新构造而prototype是原型共享，所有实例化后，都共同引用同一个
     this.sayAge = function(){
         alert(name); //在公有方法中可以访问私有成员
     }
     //因而实例越多占用的内存越多
 }
 
 myObject.prototype.sayAge2 = function () {};
 
var b = new myObject();
b.hasOwnProperty("myMsg")       //true
b.hasOwnProperty("name")        //false
b.hasOwnProperty("sayName")     //false
b.hasOwnProperty("sayAge")      //true
b.hasOwnProperty("sayAge2")     //false

</pre>
<img src="./img/javascript_object_layout.jpg" />
