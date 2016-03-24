<pre>
  function makeFunc() {
    var name = "Mozilla";
    function displayName() {
      alert(name);
    }
    return displayName;
  }
  
  var myFunc = makeFunc();
  myFunc();
</pre>
<table>
<thead>
    <tr>
        <th>变量名</th>
        <th>变量值</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>person</td>
        <td>x01020203(堆地址，即指向堆空间的指针)</td>
    </tr>
</tbody>
</table>
<p>
    当函数f执行完毕时，栈空间的内存立即被回收，指向堆的引用自然也断了。此时堆空间所占用的内存 就处于等待被垃圾收集器回收的阶段。这段内存无法再通过程序访问到。
 </p>
 <p>
    这是垃圾回收简单的过程，但是当一个堆空间的对象还被栈空间的变量引用到时，垃圾收集器是无法 回收堆空间内存的。由于这个特性再加上变量的作用域链，就可能出现如下代码：
</p>
<pre>
  var fn = function() {
      var person = {
          name: '张三',
          say: function() {
              console.log('my name is:' + this.name)
          }
      }；
      return function() {
          person.say();
      };
  }();
</pre>
<p>
   在上面的代码中，fn赋值为了一个立即执行的函数，这个函数又返回了一个匿名的函数，但是立即执行     函数执行后，person对象所占内存空间依旧得不到释放，因为返回的匿名函数内部还持有person对象 的引用，像这种运行时的上下文就被称为闭包。
</p>
