一、创建scope对象
function Scope() {
  this.$$watchers = [];
}

二、监控对象属性：$watch和$digest
<ul>
  <li>
    一个监控函数$watch，用于指定所关注的那部分数据。
  </li>
  <li>
    一个监听函数$digest，用于在数据变更的时候接受提示。
  </li>
<ul>

<pre>
  Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
      watchFn: watchFn,
      listenerFn: listenerFn
    };
    this.$$watchers.push(watcher);
  };
  
  Scope.prototype.$digest = function() {
    this.$$watchers.forEach(function(watch) {
      watch.listenerFn();
    });  
  };
</pre>
三、脏值检测
<pre>
  Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
      watchFn: watchFn,
      listenerFn: listenerFn
    };
    this.$$watchers.push(watcher);
  };
  
  Scope.prototype.$digest = function() {
    <b>var self = this;
    this.$$watchers.forEach(function(watch) {
      var newValue = watch.watchFn(self);
      var oldValue = watch.last;
      if (newValue != oldValue) {
        watch.listenerFn(newValue, oldValue, self);
      }
      watch.last = newValue;
    });</b>  
  };
</pre>


<a href="http://www.cnblogs.com/xuezhi/p/4897831.html">参考1</a>
<a href="http://www.ituring.com.cn/article/39865">参考2</a>
