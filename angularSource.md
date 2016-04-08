<a href="http://www.angularjs.cn/A0Ad">参考</a>

<a href="https://github.com/teropa/build-your-own-angularjs">build your own angularjs</a>


##angularjs打包顺序
从angularFiles.js中就可以看到angular.js是如何打包的？

###angularjs核心代码
<pre>
(function(window, document, undefined) {'use strict';

  // ...

  // 判断代码angularjs重复加载
  if (window.angular.bootstrap) {
       console.log('WARNING: Tried to load angular more than once.');
    return;
  }

  // 绑定jQuery或者jqLite，实现angular.element  
  bindJQuery();

  // 暴露api，挂载一些通用方法，如：angular.forEach
  // 实现angular.module，并定义模块ng，以及ngLocale
  publishExternalAPI(angular);

  // 当dom ready时，开始执行程序的初始化
  jqLite(document).ready(function() {
    // 初始化入口
    angularInit(document, bootstrap);
  });

})(window, document);
</pre>

###setupModuleLoader函数（src/loader.js）
<ul>
  <li>这里定义了angular.module方法，该方法用来注册模块并返回模块实例，像上面所说的ng和ngLocale模块都是通过它注册的。</li>
</ul>

<pre>
function setupModuleLoader(window) {

  // 异常处理，可以忽略
  var $injectorMinErr = minErr('$injector');
  var ngMinErr = minErr('ng');

  // 获取指定obj的name属性
  // 不存在的话，利用factory函数创建并存储在obj.name下，方便下次获取
  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  // 获取angular全局变量
  var angular = ensure(window, 'angular', Object);

  angular.$$minErr = angular.$$minErr || minErr;

  // 定义angular.module方法并返回
  return ensure(angular, 'module', function() {

    // 利用闭包，缓存模块实例
    var modules = {};

    // angular.module 的方法实现
    // 如果参数是一个，获取指定name的模块（getter操作）
    // 否则，（重新）创建模块实例并存储（setter操作），最后返回
    return function module(name, requires, configFn) {

      // 检测模块名不能是'hasOwnProperty'
      var assertNotHasOwnProperty = function(name, context) {
        if (name === 'hasOwnProperty') {
          throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
        }
      };

      // 检测模块名
      assertNotHasOwnProperty(name, 'module');

      // 如果参数不止一个（requires存在，哪怕是[]）,表现为setter操作
      // 如果该模块已存在，那么置为null，重新创建
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }

      // 获取指定name模块的模块
      // 从modules缓存中取或者（重新）创建新的模块实例
      return ensure(modules, name, function() {

        // 程序走到这里，表示是新模块的创建过程
        // 而requires如果为空，则表示是获取已有的模块
        // 两者其实是相互矛盾的，所以抛出异常，说明该模块还没有注册
        // 所以我们在创建模块时，就算没有依赖其他模块，写法也应该是：
        // angular.module('myModule', []);
        if (!requires) {
          throw $injectorMinErr('nomod', "Module '{0}' is not available! You either misspelled " +
             "the module name or forgot to load it. If registering a module ensure that you " +
             "specify the dependencies as the second argument.", name);
        }

        var invokeQueue = [];

        var configBlocks = [];

        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke', 'push', configBlocks);

        // 将要返回的module实例
        var moduleInstance = {

          _invokeQueue: invokeQueue,
          _configBlocks: configBlocks,
          _runBlocks: runBlocks,

          requires: requires,

          name: name,

          provider: invokeLater('$provide', 'provider'),

          factory: invokeLater('$provide', 'factory'),

          service: invokeLater('$provide', 'service'),

          value: invokeLater('$provide', 'value'),

          constant: invokeLater('$provide', 'constant', 'unshift'),

          animation: invokeLater('$animateProvider', 'register'),

          filter: invokeLater('$filterProvider', 'register'),

          controller: invokeLater('$controllerProvider', 'register'),

          directive: invokeLater('$compileProvider', 'directive'),

          config: config,

          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        };

        if (configFn) {
          config(configFn);
        }

        return  moduleInstance;

        // 通过该方法对module实例的一系列常用方法进行包装，如myModule.provider，myModule.controller
        // 我们在调用myModule.provider(...)时实质上是数据存储（push或者unshift）而不是立即注册服务
        // 这一点我们从invokeLater的字面意思（之后再调用）也可以看出
        // 那么真正的执行（如注册服务），是在angularInit之后，准确的说是在loadModules的时候（之后会说到）
        function invokeLater(provider, method, insertMethod, queue) {

          // 默认队列是invokeQueue，也可以是configBlocks
          // 默认队列操作是push，也可以是unshift
          if (!queue) queue = invokeQueue;
          return function() {
            queue[insertMethod || 'push']([provider, method, arguments]);
            return moduleInstance;
          };
        }
      });
    };
  });

}
</pre>




###publishExternalAPI函数（src/AngularPublic.js）

<ul>
  <li>将一些通用方法挂载到全局变量angular上</li>
  <li>注册两个模块ng 和 ngLocale（其中ng依赖ngLocale）</li>
  <li>ng模块的回调函数用来注册angular内置的service和directive（该回调将在angularInit后被执行)</li>
</ul>

<pre>
function publishExternalAPI(angular){
  // 将通用方法挂载到全局变量augular上
  extend(angular, {
    'bootstrap': bootstrap,
    'copy': copy,
    'extend': extend,
    'equals': equals,
    'element': jqLite,
    'forEach': forEach,
    'injector': createInjector,
    // ...省略若干通用方法
  });

  // 实现angular.module方法并赋值给angularModule
  angularModule = setupModuleLoader(window);

  try {
    // 获取ngLocale模块
    // 如果获取不到，则会报出异常
    angularModule('ngLocale');
  } catch (e) {
    // 接受异常（也就是没有获取不到ngLocale模块）
    // 在这里注册ngLocale模块
    angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
  }

  // 注册ng模块（此模块依赖ngLocale模块）
  // 回调中注册N多service，以及N多directive（回调等待初始化angularInit后执行）
  angularModule('ng', ['ngLocale'], ['$provide',
    function ngModule($provide) {
      // $$sanitizeUriProvider needs to be before $compileProvider as it is used by it.
      $provide.provider({
        $$sanitizeUri: $$SanitizeUriProvider
      });
      $provide.provider('$compile', $CompileProvider).
        directive({
            a: htmlAnchorDirective,
            input: inputDirective,
            textarea: inputDirective,
            form: formDirective,
            // ...省略若干directive
        }).
        directive({
          ngInclude: ngIncludeFillContentDirective
        }).
        directive(ngAttributeAliasDirectives).
        directive(ngEventDirectives);
      $provide.provider({
        $anchorScroll: $AnchorScrollProvider,
        $animate: $AnimateProvider,
        $browser: $BrowserProvider,
        // ...省略若干service
      });
    }
  ]);
}
</pre>



