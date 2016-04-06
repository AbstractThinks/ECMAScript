function Scope() { 
  this.$$watchers = []; 
  this.$$asyncQueue = [];
  this.$$postDigestQueue = [];
  this.$$phase = null;
}

/**
 * [$watch description]
 * 注册函数
 * @param  {[type]} watchFn    [description]
 * @param  {[type]} listenerFn [description]
 * @return {[type]}            [description]
 */
Scope.prototype.$watch = function(watchFn, listenerFn, valueEq) {
  var self = this;
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() {},
    valueEq: !!valueEq
  };
  this.$$watchers.push(watcher);
  return function() {
    var index = self.$$watchers.indexOf(watcher);
    if (index >= 0) {
      self.$$watchers.splice(index, 1);
    }
  };
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
    try {

      var newValue = watch.watchFn(self);
      var oldValue = watch.last;
      if (!self.$$areEqual(newValue, oldValue, watch.valueEq)) {
        watch.listenerFn(newValue, oldValue, self);
        dirty = true;
      }
      watch.last = (watch.valueEq ? _.cloneDeep(newValue) : newValue);
      
    } catch (e) {
      (console.error || console.log)(e);
    }
   
  }); 
  return dirty;
};

Scope.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$beginPhase("$digest");
  do {
    //如果当作用域还是脏的，就想把一个函数延迟执行，那这个函数会在稍后执行，但还处于同一个digest中。
    while (this.$$asyncQueue.length) {
      //shift返回数组第一个元素，并将此元素从原数组删除
      try {
        var asyncTask = this.$$asyncQueue.shift();
        this.$eval(asyncTask.expression);
      } catch (e) {
        (console.error || console.log)(e);
      }
    }
    dirty = this.$$digestOnce();
    if (dirty && !(ttl--)) {
      console.log("10 digest iterations reached");
    }
  } while (dirty);
  this.$clearPhase();
  while (this.$$postDigestQueue.length) {
    try {
      this.$$postDigestQueue.shift()();
    } catch (e) {
      (console.error || console.log)(e);
    }
  }
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
//集成外部代码与digest循环
Scope.prototype.$apply = function(expr) {
  try {
    this.$beginPhase("$apply");
    return this.$eval(expr);
  } finally {
    this.$clearPhase();
    this.$digest();
  }
};

Scope.prototype.$evalAsync = function(expr) {
  var self = this;
  if (!self.$$phase && !self.$$asyncQueue.length) {
    setTimeout(function() {
      if (self.$$asyncQueue.length) {
        self.$digest();
      }
    }, 0);
  }
  self.$$asyncQueue.push({scope: self, expression: expr});
};

Scope.prototype.$beginPhase = function(phase) {
  if (this.$$phase) {
    console.log(this.$$phase + ' already in progress.') ;
  }
  this.$$phase = phase;
};

Scope.prototype.$clearPhase = function() {
  this.$$phase = null;
};
//在digest函数之后执行 
Scope.prototype.$$postDigest = function(fn) {
  this.$$postDigestQueue.push(fn);
};

var scope = new Scope();
scope.aValue = "abc";
scope.counter = 0;
scope.aValue2 = "123"
scope.aValue3 = "1234567"

var removeWatch = scope.$watch(
  function(scope) {
    return scope.aValue;
  },
  function(newValue, oldValue, scope) {
    scope.counter++;
  }
);
var removeWatch2 = scope.$watch(
  function(scope) {
    return scope.aValue2;
  },
  function(newValue, oldValue, scope) {
    scope.counter++;
  }
);
var removeWatch3 = scope.$watch(
  function(scope) {
    return scope.aValue3;
  },
  function(newValue, oldValue, scope) {
    scope.counter++;
  }
);

scope.$digest();
console.log(scope.counter === 1);

scope.aValue = 'def';
scope.$digest();
console.log(scope.counter === 2);

removeWatch();
removeWatch3();
scope.aValue = 'ghi';
scope.$digest();
console.log(scope.counter === 2); // No longer incrementing

