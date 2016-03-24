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
    
<pre>
