<h3>全局作用域</h3>

<pre>
    
    console.log(a);   //报错
    
    ====================================
    
    console.log(a);   //undefined
    var a;
    
    ====================================
    
    console.log(a);     等同于     var a;
                        ======》    console.log(a);     //undefined
    var a = 10                      a = 10;
    
    ====================================
    
    console.log(a);                       //function a(){}
    function a() {}
    
    ====================================
    
    console.log(a);                       //undefined
    var a = function () {}
    
    
    总结：
        js在内存中的执行顺序
        1.变量、函数表达式——变量声明，默认赋值为undefined；
        2.this——赋值；
        3.变量——赋值；
</pre>    

<h3>函数作用域</h3>

<pre>

    var a = 10;
    function b(){
        console.log(a);     //10
    }
    function c(x) {
        var a = 20;
        x();
        function display() {
            console.log(a);
        }
        display()   //20
    }
    c(b);           //10 20
    
    函数在定义的时候（不是调用的时候），就已经确定了函数体内部自由变量的作用域
    函数每被调用一次，都会产生一个新的执行上下文环境
    
    
<pre>
