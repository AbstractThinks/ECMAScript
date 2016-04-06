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
Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() {},
    valueEq: !!valueEq
  };
  this.$$watchers.push(watcher);
};

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
    if (!self.$$areEqual(newValue, oldValue, watch.valueEq)) {
      watch.listenerFn(newValue, oldValue, self);
      dirty = true;
    }
    watch.last = (watch.valueEq ? _.cloneDeep(newValue) : newValue);
  }); 
  return dirty;
};

Scope.prototype.$digest = function() {
  var dirty;
  do {
    dirty = this.$$digestOnce();
  } while (dirty);
};

Scope.prototype.$$areEqual = function (newValue, oldValue, valueEq) {
  if (valueEq) {
    //对象内部进行深层比较
    return _.isEqual(newValue, oldValue)
  } else {
    //处理NaN（Not-a-Number）并不等于自身
    //typeof NaN === 'number'    true
    //isNaN(NaN)                  true
    return newValue === oldValue || (typeof newValue === 'number' && typeof oldValue === 'number' &&
       isNaN(newValue) && isNaN(oldValue));;
  }

}

Scope.prototype.$eval = function(expr, locals) {
  return expr(this, locals);
};
 

var scope = new Scope();
scope.number = 1;

scope.$eval(function(theScope) {
  console.log('Number during $eval:', theScope.number);
});

