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
// Scope.prototype.$digest = function() {

//   var self = this;

//   this.$$watchers.forEach(function(watch) {
//     var newValue = watch.watchFn(self);
//     var oldValue = watch.last;
//     if (newValue != oldValue) {
//       watch.listenerFn(newValue, oldValue, self);
//     }
//     watch.last = newValue;
//   }); 

// };
/**
 * [$digest description]
 * 触发函数升级版
 * @return {[type]} [description]
 */
Scope.prototype.$$digestOnce = function() {

  var self = this;
  var dirty;
  this.$$watchers.forEach(function(watch) {
    var newValue = watch.watchFn(self);
    var oldValue = watch.last;
    if (newValue != oldValue) {
      watch.listenerFn(newValue, oldValue, self);
      dirty = true;
    }
    watch.last = newValue;
  }); 
  return dirty;
};

Scope.prototype.$digest = function() {
  var dirty;
  do {
    dirty = this.$$digestOnce();
  } while (dirty);
};



// var scope = new Scope();
// scope.$watch(
//   function() {console.log('watchFn'); },
//   function() {console.log('listener'); }
// );

// scope.$digest();
 
var scope = new Scope();
scope.counter1 = 0;
scope.counter2 = 0;

scope.$watch(
  function(scope) {
    return scope.counter1;
  },
  function(newValue, oldValue, scope) {
    scope.counter2++;
  }
);

scope.$watch(
  function(scope) {
    return scope.counter2;
  },
  function(newValue, oldValue, scope) {
    scope.counter1++;
  }
);

// Uncomment this to run the digest
scope.$digest();

console.log(scope.counter1);
