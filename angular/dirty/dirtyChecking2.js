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
scope.firstName = 'Joe';
scope.counter = 0;

scope.$watch(
  function(scope) {
    return scope.firstName;
  },
  function(newValue, oldValue, scope) {
    scope.counter++;
  }
);

// console.log(scope.counter === 0);
scope.$digest();
// console.log(scope.counter === 1);

// scope.$digest();
// scope.$digest();
// console.log(scope.counter === 1);


scope.firstName = 'Jane';
scope.$digest();
console.log(scope.counter === 2);
