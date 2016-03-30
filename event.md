<h3>js事件机制</h3>

js事件机制可分为三个阶段

<b>捕获阶段</b>

<b>目标阶段</b>

<b>冒泡阶段</b>

W3C标准
<b>element.addEventListener(event, function, useCapture) </b>

useCapture参数为false表示在<b>冒泡阶段</b>执行，为true表示在<b>捕获阶段</b>执行，默认为false

<b>element.removeEventListener(event, function, useCapture)</b>
<pre>
例：
// 向&lt;div&gt;元素添加事件句柄
document.getElementById("myDIV").addEventListener("mousemove", myFunction);

// 移除&lt;div&gt;元素的事件句柄
document.getElementById("myDIV").removeEventListener("mousemove", myFunction);
</pre>
IE下

<b>element.attachEvent(event, function) </b>

IE没有useCapture参数，只支持<b>冒泡阶段</b>执行

<b>elem.detachEvent(event_type,event_name)</b>
<pre>
例：
// 向&lt;div&gt;元素添加事件句柄
document.getElementById("myDIV").attachEvent("onmousemove", myFunction);

// 移除&lt;div&gt;元素的事件句柄
document.getElementById("myDIV").detachEvent("onmousemove", myFunction);
</pre>

<h3>e事件对象</h3>
<pre>
  var a = document.getElementById('test');
  a.addEventListener('click', function(event) {
  //这里面event.target就是a对象
  
  }, false);
</pre>
srcElement是早期IE下的属性,IE11同时有这两个属性 

target是Firefox下的属性

Chrome浏览器同时有这两个属性 
