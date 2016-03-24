<h3>作为对象方法调用</h3>
<pre>
var point = { 
 x : 0, 
 y : 0, 
 moveTo : function(x, y) { 
     this.x = this.x + x; 
     this.y = this.y + y; 
     } 
 }; 

 point.moveTo(1, 1)      //this 绑定到当前对象，即 point 对象
</pre>

<h3></h3>
<pre>
function makeNoSense(x) { 
 this.x = x;                //this绑定到window上
 } 

 makeNoSense(5); 
 x;// x 已经成为一个值为 5 的全局变量
 
 ================
  JavaScript 的设计缺陷
 var point = { 
 x : 0, 
 y : 0, 
 moveTo : function(x, y) { 
     // 内部函数
     var moveX = function(x) { 
     this.x = x;//this 绑定到了window
    }; 
    // 内部函数
    var moveY = function(y) { 
    this.y = y;//this 绑定到了window
    }; 

    moveX(x); 
    moveY(y); 
    } 
 }; 
 point.moveTo(1, 1); 
 point.x; //==>0 
 point.y; //==>0 
 x; //==>1 
 y; //==>1
</pre>

<h3>作为构造函数调用</h3>
<pre>
 function Point(x, y){ 
    this.x = x;     //this 绑定到新创建的对象上
    this.y = y; 
 }
 var p = new Point(1,1)
 p.x   //1
</pre>

<h3>使用 apply 或 call 或 bind调用</h3>
<pre>
   this.x = x; 
    this.y = y; 
    this.moveTo = function(x, y){ 
        this.x = x; 
        this.y = y; 
    } 
 } 

 var p1 = new Point(0, 0); 
 var p2 = {x: 0, y: 0}; 
 p1.moveTo(1, 1); 
 p1.moveTo.apply(p2, [10, 10]);
</pre>
