function Scope() { 
  this.$$watchers = []; 
}

/**
 * [$watch description]
 * 注册函数
 * @param  {[type]} watchFn    [description]
 * @param  {[type]} listenerFn [description]
 * @return {[type]}            [description]
 */
Scope.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() {}
  };
  this.$$watchers.push(watcher);
};

/**
 * [$digest description]
 * 触发函数
 * @return {[type]} [description]
 */
Scope.prototype.$digest = function() {

  var self = this;

  this.$$watchers.forEach(function(watch) {
    var newValue = watch.watchFn(self);
    var oldValue = watch.last;
    if (newValue != oldValue) {
      watch.listenerFn(newValue, oldValue, self);
    }
    watch.last = newValue;
  }); 

};




var scope = new Scope();
scope.$watch(
  function() {console.log('watchFn'); },
  function() {console.log('listener'); }
);

scope.$digest();
 