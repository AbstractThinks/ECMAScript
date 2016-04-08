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

##angularInit函数（src/Angular.js）
<ul>
  <li>当dom ready时，该函数开始运行，通过调用bootstrap函数进行整个angular应用的初始化工作。</li>
  <li>这里传递给bootstrap两个函数：应用根节点（含有xx-app属性的dom）和启动模块（xx-app的值） xx 为 ['ng-', 'data-ng-', 'ng:', 'x-ng-'] 任一一种，这里做了兼容多种属性名</li>
</ul>

<pre>
function angularInit(element, bootstrap) {
  var appElement,
      module,
      config = {};

  // ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];
  // 支持多种节点属性表达方式，通过用循环方式查找含有xx-app属性的节点（appElement）
  // 先对element（即document）进行判断，再从element中的子孙元素中查找
  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';

    if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
      appElement = element;
      module = element.getAttribute(name);
    }
  });
  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';
    var candidate;

    if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
      appElement = candidate;
      module = candidate.getAttribute(name);
    }
  });

  // 如果应用节点存在，那么启动整个应用（即bootstrap）
  // 如果appElement含有xx-strict-di属性，那么设置严格依赖注入参数？
  if (appElement) {
    config.strictDi = getNgAttribute(appElement, "strict-di") !== null;
    bootstrap(appElement, module ? [module] : [], config);
  }
}
</pre>

###bootstrap函数（src/Angular.js）
<ul>
  <li>程序的核心初始化起始于该函数 除了通过ng-app指令自动初始化应用（间接调用bootstrap）外，我们也可以手动调用angular.bootstrap(...)来初始化应用</li>
</ul>

<pre>
function bootstrap(element, modules, config) {
  // ...省略若干代码
  var doBootstrap = function() {
    element = jqLite(element);

    // 首先判断该dom是否已经被注入（即这个dom已经被bootstrap过）
    // 注意这里的injector方法是Angular为jqLite中提供的，区别于一般的jQuery api
    if (element.injector()) {
      var tag = (element[0] === document) ? 'document' : startingTag(element);
      //Encode angle brackets to prevent input from being sanitized to empty string #8683
      throw ngMinErr(
          'btstrpd',
          "App Already Bootstrapped with this Element '{0}'",
          tag.replace(/</,'<').replace(/>/,'>'));
    }

    modules = modules || [];

    // 添加匿名模块
    modules.unshift(['$provide', function($provide) {
      $provide.value('$rootElement', element);
    }]);

    if (config.debugInfoEnabled) {
      // Pushing so that this overrides `debugInfoEnabled` setting defined in user's `modules`.
      modules.push(['$compileProvider', function($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
      }]);
    }

    // 添加ng模块
    modules.unshift('ng');

    // 到这里modules可能是: ['ng', [$provide, function($provide){...}], 'xx']
    // xx: ng-app="xx" 

    // 创建injector对象，注册所有的内置模块
    var injector = createInjector(modules, config.strictDi);

    // 利用injector的依赖注入，执行回调
    injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector',
       function bootstrapApply(scope, element, compile, injector) {
        scope.$apply(function() {
          // 标记该dom已经被注入
          element.data('$injector', injector);
          // 编译整个dom
          compile(element)(scope);
        });
      }]
    );
    return injector;
  };

  // ...省略若干代码

  if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
    return doBootstrap();
  }
  // ...省略若干代码
}

###createInjector函数（src/auto/injector.js）

<ul>
  <li>实现依赖注入，创建injector实例</li>
  <li>providerCache（所有xxProvider类的缓存，xx可以是Locale，Timeout）</li>
  <li>instanceCache（所有xxProvider返回的实例缓存）</li>
  <li>providerInjector（内部injector实例，负责类层级的依赖注入）</li>
  <li>instanceInjector（外部可访问injector实例，负责实例层级的依赖注入）</li>
</ul>
<pre>
function createInjector(modulesToLoad, strictDi) {
  strictDi = (strictDi === true);
  var INSTANTIATING = {},
      providerSuffix = 'Provider',
      path = [],
      loadedModules = new HashMap([], true),
      providerCache = {
        $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
      },
      providerInjector = (providerCache.$injector =
          createInternalInjector(providerCache, function() {
            throw $injectorMinErr('unpr', "Unknown provider: {0}", path.join(' &gt- '));
      })),
      instanceCache = {},
      instanceInjector = (instanceCache.$injector =
          createInternalInjector(instanceCache, function(servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider, undefined, servicename);
          }));

  // 循环加载模块，实质上是：
  // 1. 注册每个模块上挂载的service（也就是_invokeQueue）
  // 2. 执行每个模块的自身的回调（也就是_configBlocks）
  // 3. 通过依赖注入，执行所有模块的_runBlocks
  forEach(loadModules(modulesToLoad), function(fn) { instanceInjector.invoke(fn || noop); });

  return instanceInjector;

  // ...省略若干函数定义
 }
</pre>
这里providerCache预存了$provider服务类，用来提供自定义service的注册，支持下面几个方法：
<pre>
$provide: {
    provider: supportObject(provider),
    factory: supportObject(factory),
    service: supportObject(service),
    value: supportObject(value),
    constant: supportObject(constant),
    decorator: decorator
}
</pre>
之后providerCache.$injector=createInternalInjector(...);又将$injector服务缓存进来（其实之后注册的服务都将陆续添加进来）

###createInternalInjector函数（src/auto/injector.js）
<ul>
  <li>创建injector实例，如：providerInjector和instanceInjector</li>
</ul>
<pre>
function createInternalInjector(cache, factory) {

  function getService(serviceName) {/*省略代码实现*/}

  function invoke(fn, self, locals, serviceName) {/*省略代码实现*/}

  function instantiate(Type, locals, serviceName) {/*省略代码实现*/}

  // 返回injector实例
  return {
    invoke: invoke,
    instantiate: instantiate,
    get: getService,
    annotate: annotate,
    has: function(name) {
      return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
    }
  };
}
</pre>

###loadModules函数（src/auto/injector.js）
<ul>
  <li>加载应用依赖模块以及内置的ng模块等，就像之前说的类似这样：['ng', [$provide, function($provide){...}], 'xx'] 执行每个模块的_runBlocks，可以理解injector创建完后模块的初始化（通过myModule.run(...)注册的）</li>
<ul>
<pre>
function loadModules(modulesToLoad){
    var runBlocks = [], moduleFn;

    // 循环加载每个module,
    // 1. 注册每个模块上挂载的service（也就是_invokeQueue）
    // 2. 执行每个模块的自身的回调（也就是_configBlocks）
    // 3. 通过递归搜集所有（依赖）模块的_runBlocks，并返回
    forEach(modulesToLoad, function(module) {

      // 判断模块是否已经加载过
      if (loadedModules.get(module)) return;

      // 设置模块已经加载过
      loadedModules.put(module, true);

      function runInvokeQueue(queue) {
        var i, ii;
        for(i = 0, ii = queue.length; i < ii; i++) {

          var invokeArgs = queue[i],
              provider = providerInjector.get(invokeArgs[0]);

          // 通过providerInjector获取指定服务（类），传递参数并执行指定方法
          provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
        }
      }

      // 模块可以是以下三种情况：
      // 1. 字符串表示模块名（注册过的模块），如：'ng'模块
      // 2. 普通函数（也可以是隐式声明依赖的函数），如：function($provider) {...}
      // 3. 数组（即声明依赖的函数）如：[$provide, function($provide){...}
      try {
        if (isString(module)) {
          // 获取通过模块名获取模块对象
          moduleFn = angularModule(module);
          // 通过递归加载所有依赖模块，并且获取所有依赖模块（包括自身）的_runBlocks
          runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
          // 遍历_invokeQueue数组依次执行$provider服务的指定方法（如：factory，value等）
          runInvokeQueue(moduleFn._invokeQueue);
          // 遍历_configBlocks数组依次执行$injector服务的invoke方法（即依赖注入并执行回调）
          runInvokeQueue(moduleFn._configBlocks);

        // 如果module是函数或者数组（可认为是匿名模块），那么依赖注入后直接执行
        // 并将返回值保存到runBlocks（可能是函数，又将继续执行）
        } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else {
          assertArgFn(module, 'module');
        }
      } catch (e) {
        if (isArray(module)) {
          module = module[module.length - 1];
        }
        if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
          e = e.message + '\n' + e.stack;
        }
        throw $injectorMinErr('modulerr', "Failed to instantiate module {0} due to:\n{1}",
                  module, e.stack || e.message || e);
      }
    });
    return runBlocks;
  }
</pre>
到这里在注册ng模块时的回调，在runInvokeQueue(moduleFn._configBlocks);已经执行过了，也就意味着许许多多的内置模块已经存入providerCache中了，所以在后面的依赖注入中我们可以随意调用。

 


