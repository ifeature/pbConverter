/**
 * @license almond 0.3.1 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
  var main, req, makeMap, handlers,
    defined = {},
    waiting = {},
    config = {},
    defining = {},
    hasOwn = Object.prototype.hasOwnProperty,
    aps = [].slice,
    jsSuffixRegExp = /\.js$/;

  function hasProp(obj, prop) {
    return hasOwn.call(obj, prop);
  }

  /**
   * Given a relative module name, like ./something, normalize it to
   * a real name that can be mapped to a path.
   * @param {String} name the relative name
   * @param {String} baseName a real name that the name arg is relative
   * to.
   * @returns {String} normalized name
   */
  function normalize(name, baseName) {
    var nameParts, nameSegment, mapValue, foundMap, lastIndex,
      foundI, foundStarMap, starI, i, j, part,
      baseParts = baseName && baseName.split("/"),
      map = config.map,
      starMap = (map && map['*']) || {};

    //Adjust any relative paths.
    if (name && name.charAt(0) === ".") {
      //If have a base name, try to normalize against it,
      //otherwise, assume it is a top-level require that will
      //be relative to baseUrl in the end.
      if (baseName) {
        name = name.split('/');
        lastIndex = name.length - 1;

        // Node .js allowance:
        if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
          name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
        }

        //Lop off the last part of baseParts, so that . matches the
        //"directory" and not name of the baseName's module. For instance,
        //baseName of "one/two/three", maps to "one/two/three.js", but we
        //want the directory, "one/two" for this normalization.
        name = baseParts.slice(0, baseParts.length - 1).concat(name);

        //start trimDots
        for (i = 0; i < name.length; i += 1) {
          part = name[i];
          if (part === ".") {
            name.splice(i, 1);
            i -= 1;
          } else if (part === "..") {
            if (i === 1 && (name[2] === '..' || name[0] === '..')) {
              //End of the line. Keep at least one non-dot
              //path segment at the front so it can be mapped
              //correctly to disk. Otherwise, there is likely
              //no path mapping for a path starting with '..'.
              //This can still fail, but catches the most reasonable
              //uses of ..
              break;
            } else if (i > 0) {
              name.splice(i - 1, 2);
              i -= 2;
            }
          }
        }
        //end trimDots

        name = name.join("/");
      } else if (name.indexOf('./') === 0) {
        // No baseName, so this is ID is resolved relative
        // to baseUrl, pull off the leading dot.
        name = name.substring(2);
      }
    }

    //Apply map config if available.
    if ((baseParts || starMap) && map) {
      nameParts = name.split('/');

      for (i = nameParts.length; i > 0; i -= 1) {
        nameSegment = nameParts.slice(0, i).join("/");

        if (baseParts) {
          //Find the longest baseName segment match in the config.
          //So, do joins on the biggest to smallest lengths of baseParts.
          for (j = baseParts.length; j > 0; j -= 1) {
            mapValue = map[baseParts.slice(0, j).join('/')];

            //baseName segment has  config, find if it has one for
            //this name.
            if (mapValue) {
              mapValue = mapValue[nameSegment];
              if (mapValue) {
                //Match, update name to the new value.
                foundMap = mapValue;
                foundI = i;
                break;
              }
            }
          }
        }

        if (foundMap) {
          break;
        }

        //Check for a star map match, but just hold on to it,
        //if there is a shorter segment match later in a matching
        //config, then favor over this star map.
        if (!foundStarMap && starMap && starMap[nameSegment]) {
          foundStarMap = starMap[nameSegment];
          starI = i;
        }
      }

      if (!foundMap && foundStarMap) {
        foundMap = foundStarMap;
        foundI = starI;
      }

      if (foundMap) {
        nameParts.splice(0, foundI, foundMap);
        name = nameParts.join('/');
      }
    }

    return name;
  }

  function makeRequire(relName, forceSync) {
    return function () {
      //A version of a require function that passes a moduleName
      //value for items that may need to
      //look up paths relative to the moduleName
      var args = aps.call(arguments, 0);

      //If first arg is not require('string'), and there is only
      //one arg, it is the array form without a callback. Insert
      //a null so that the following concat is correct.
      if (typeof args[0] !== 'string' && args.length === 1) {
        args.push(null);
      }
      return req.apply(undef, args.concat([relName, forceSync]));
    };
  }

  function makeNormalize(relName) {
    return function (name) {
      return normalize(name, relName);
    };
  }

  function makeLoad(depName) {
    return function (value) {
      defined[depName] = value;
    };
  }

  function callDep(name) {
    if (hasProp(waiting, name)) {
      var args = waiting[name];
      delete waiting[name];
      defining[name] = true;
      main.apply(undef, args);
    }

    if (!hasProp(defined, name) && !hasProp(defining, name)) {
      throw new Error('No ' + name);
    }
    return defined[name];
  }

  //Turns a plugin!resource to [plugin, resource]
  //with the plugin being undefined if the name
  //did not have a plugin prefix.
  function splitPrefix(name) {
    var prefix,
      index = name ? name.indexOf('!') : -1;
    if (index > -1) {
      prefix = name.substring(0, index);
      name = name.substring(index + 1, name.length);
    }
    return [prefix, name];
  }

  /**
   * Makes a name map, normalizing the name, and using a plugin
   * for normalization if necessary. Grabs a ref to plugin
   * too, as an optimization.
   */
  makeMap = function (name, relName) {
    var plugin,
      parts = splitPrefix(name),
      prefix = parts[0];

    name = parts[1];

    if (prefix) {
      prefix = normalize(prefix, relName);
      plugin = callDep(prefix);
    }

    //Normalize according
    if (prefix) {
      if (plugin && plugin.normalize) {
        name = plugin.normalize(name, makeNormalize(relName));
      } else {
        name = normalize(name, relName);
      }
    } else {
      name = normalize(name, relName);
      parts = splitPrefix(name);
      prefix = parts[0];
      name = parts[1];
      if (prefix) {
        plugin = callDep(prefix);
      }
    }

    //Using ridiculous property names for space reasons
    return {
      f: prefix ? prefix + '!' + name : name, //fullName
      n: name,
      pr: prefix,
      p: plugin
    };
  };

  function makeConfig(name) {
    return function () {
      return (config && config.config && config.config[name]) || {};
    };
  }

  handlers = {
    require: function (name) {
      return makeRequire(name);
    },
    exports: function (name) {
      var e = defined[name];
      if (typeof e !== 'undefined') {
        return e;
      } else {
        return (defined[name] = {});
      }
    },
    module: function (name) {
      return {
        id: name,
        uri: '',
        exports: defined[name],
        config: makeConfig(name)
      };
    }
  };

  main = function (name, deps, callback, relName) {
    var cjsModule, depName, ret, map, i,
      args = [],
      callbackType = typeof callback,
      usingExports;

    //Use name if no relName
    relName = relName || name;

    //Call the callback to define the module, if necessary.
    if (callbackType === 'undefined' || callbackType === 'function') {
      //Pull out the defined dependencies and pass the ordered
      //values to the callback.
      //Default to [require, exports, module] if no deps
      deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
      for (i = 0; i < deps.length; i += 1) {
        map = makeMap(deps[i], relName);
        depName = map.f;

        //Fast path CommonJS standard dependencies.
        if (depName === "require") {
          args[i] = handlers.require(name);
        } else if (depName === "exports") {
          //CommonJS module spec 1.1
          args[i] = handlers.exports(name);
          usingExports = true;
        } else if (depName === "module") {
          //CommonJS module spec 1.1
          cjsModule = args[i] = handlers.module(name);
        } else if (hasProp(defined, depName) ||
          hasProp(waiting, depName) ||
          hasProp(defining, depName)) {
          args[i] = callDep(depName);
        } else if (map.p) {
          map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
          args[i] = defined[depName];
        } else {
          throw new Error(name + ' missing ' + depName);
        }
      }

      ret = callback ? callback.apply(defined[name], args) : undefined;

      if (name) {
        //If setting exports via "module" is in play,
        //favor that over return value and exports. After that,
        //favor a non-undefined return value over exports use.
        if (cjsModule && cjsModule.exports !== undef &&
          cjsModule.exports !== defined[name]) {
          defined[name] = cjsModule.exports;
        } else if (ret !== undef || !usingExports) {
          //Use the return value from the function.
          defined[name] = ret;
        }
      }
    } else if (name) {
      //May just be an object definition for the module. Only
      //worry about defining if have a module name.
      defined[name] = callback;
    }
  };

  requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
    if (typeof deps === "string") {
      if (handlers[deps]) {
        //callback in this case is really relName
        return handlers[deps](callback);
      }
      //Just return the module wanted. In this scenario, the
      //deps arg is the module name, and second arg (if passed)
      //is just the relName.
      //Normalize module name, if it contains . or ..
      return callDep(makeMap(deps, callback).f);
    } else if (!deps.splice) {
      //deps is a config object, not an array.
      config = deps;
      if (config.deps) {
        req(config.deps, config.callback);
      }
      if (!callback) {
        return;
      }

      if (callback.splice) {
        //callback is an array, which means it is a dependency list.
        //Adjust args if there are dependencies
        deps = callback;
        callback = relName;
        relName = null;
      } else {
        deps = undef;
      }
    }

    //Support require(['a'])
    callback = callback || function () {};

    //If relName is a function, it is an errback handler,
    //so remove it.
    if (typeof relName === 'function') {
      relName = forceSync;
      forceSync = alt;
    }

    //Simulate async callback;
    if (forceSync) {
      main(undef, deps, callback, relName);
    } else {
      //Using a non-zero value because of concern for what old browsers
      //do, and latest browsers "upgrade" to 4 if lower value is used:
      //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
      //If want a value immediately, use require('id') instead -- something
      //that works in almond on the global level, but not guaranteed and
      //unlikely to work in other AMD implementations.
      setTimeout(function () {
        main(undef, deps, callback, relName);
      }, 4);
    }

    return req;
  };

  /**
   * Just drops the config on the floor, but returns req in case
   * the config return value is used.
   */
  req.config = function (cfg) {
    return req(cfg);
  };

  /**
   * Expose module registry for debugging and tooling
   */
  requirejs._defined = defined;

  define = function (name, deps, callback) {
    if (typeof name !== 'string') {
      throw new Error('See almond README: incorrect module build, no module name');
    }

    //This module may not have dependencies
    if (!deps.splice) {
      //deps is not an array, so probably means
      //an object literal or factory function for
      //the value. Adjust args.
      callback = deps;
      deps = [];
    }

    if (!hasProp(defined, name) && !hasProp(waiting, name)) {
      waiting[name] = [name, deps, callback];
    }
  };

  define.amd = {
    jQuery: true
  };
}());


define("almond", function(){});



/**
 * Модуль Модель
 * @type {{Currency, Currencies}}
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define('Model-compiled',[], function () {
  var Model = Object.create(null);

  var Currency = function Currency() {
    _classCallCheck(this, Currency);
  };

  var Currencies = function () {
    function Currencies() {
      _classCallCheck(this, Currencies);
    }
    /**
     * Метод, позволяющий конвертировать один тип валюты в другой.
     * @param {number} amount Входящая сумма
     * @param {string} from Меняю
     * @param {string} to Получаю
     * @returns {number} Результирующая сумма
     */


    _createClass(Currencies, [{
      key: 'convert',
      value: function convert(amount, from, to) {
        var result = void 0;

        if (from !== 'UAH' && to !== 'UAH') {
          var cur1 = from;
          var cur2 = to;
          var stepOne = this.convert(amount, cur1, 'UAH');
          return this.convert(stepOne, 'UAH', cur2);
        }

        if (from === 'UAH') {
          result = amount / this[to].sale;
        } else if (to === 'UAH') {
          result = amount * this[from].buy;
        }

        return Math.round(result * 1e2) / 1e2;
      }
    }]);

    return Currencies;
  }();

  Model.Currency = Currency;
  Model.Currencies = Currencies;

  return Model;
});

//# sourceMappingURL=Model-compiled.js.map;


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define('View-compiled',[], function () {
  var View = Object.create(null);

  function templateHandler() {
    var templatesObj = Object.create(null);
    var importFile = document.head.querySelector('link[rel="import"]').import;
    var templates = Array.from(importFile.getElementsByTagName('template'));

    templates.forEach(function (template) {
      templatesObj[template.id] = template.content.cloneNode(true);
    });

    return templatesObj;
  }

  var ErrorBox = function () {
    function ErrorBox(invalidFields) {
      _classCallCheck(this, ErrorBox);

      this._invaldFields = invalidFields;
      this._template = templateHandler().errorBox;
    }

    _createClass(ErrorBox, [{
      key: 'render',
      value: function render() {
        var _this = this;

        var container = document.getElementById('pbConverter').parentElement;
        var errorBox = this._template.firstElementChild.cloneNode(true);
        var errorBoxList = errorBox.querySelector('.collection');

        while (errorBoxList.childElementCount > 0) {
          errorBoxList.removeChild(errorBoxList.children[errorBoxList.childElementCount - 1]);
        }

        this._invaldFields.forEach(function (field) {
          var errorItem = _this._template.getElementById('errorBoxItem').content.cloneNode(true);
          var errorItemField = errorItem.querySelector('.errorField');
          var errorItemType = errorItem.querySelector('.errorType');

          if (field.message) {
            errorItemField.innerText = field.message;
            errorItemType.innerText = '';
          } else {
            errorItemField.innerText = field;
            errorItemType.innerText = 'Неверно заполнено поле: ';
          }

          errorBoxList.appendChild(errorItem);
        });

        while (container.childElementCount > 1) {
          container.removeChild(container.children[container.childElementCount - 1]);
        }

        container.appendChild(errorBox);
      }
    }], [{
      key: 'show',
      value: function show() {
        $('#modal1').openModal();
      }
    }, {
      key: 'hide',
      value: function hide() {
        $('#modal1').closeModal();
      }
    }]);

    return ErrorBox;
  }();

  View.initRender = function (currency) {
    function fillOptions(select, initialSelect, excludeOption) {
      var key = void 0;
      var option = void 0;
      var selectValue = void 0;
      var SYMBOL = {
        UAH: 'Украинская гривна',
        USD: 'Американский доллар',
        RUR: 'Российский рубль',
        EUR: 'Евро'
      };
      if (initialSelect) {
        selectValue = select.value;
        var initialSelectValue = initialSelect.value;
      }

      while (select.length > 0) {
        select.remove(select.length - 1);
      }

      if (!excludeOption || excludeOption !== 'UAH') {
        option = new Option('Выберите валюту', '', true, true);
        option.disabled = true;
        select.add(option);
        option = new Option(SYMBOL.UAH, 'UAH');
        select.add(option);
      }

      for (key in currency) {
        if (key === excludeOption) continue;
        option = new Option(SYMBOL[key], key);
        select.add(option);
      }

      if (initialSelect) {
        select.value = selectValue;
      }
    }

    var bindingSelect = function bindingSelect(evt) {
      var selectIDs = ['changeCurrency', 'receiveCurrency'];
      var currentTarget = evt.currentTarget;
      var selectedIDx = selectIDs.indexOf(currentTarget.id);

      switch (selectedIDx) {
        case 0:
          fillOptions(document.getElementById(selectIDs[1]), document.getElementById(selectIDs[0]), currentTarget.value);
          break;
        case 1:
          fillOptions(document.getElementById(selectIDs[0]), document.getElementById(selectIDs[1]), currentTarget.value);
          break;
        default:
          break;
      }
      $('select').material_select();
    };

    var pbConverter = document.getElementById('pbConverter');
    var templatesObj = templateHandler();

    fillOptions(templatesObj.changeCurrencyTemplate.getElementById('changeCurrency'));
    fillOptions(templatesObj.receiveCurrencyTemplate.getElementById('receiveCurrency'));

    pbConverter.appendChild(templatesObj.changeCurrencyTemplate);
    pbConverter.appendChild(templatesObj.receiveCurrencyTemplate);
    pbConverter.appendChild(templatesObj.controlsTemplate);

    $('select').material_select();
    $('select').on('change', bindingSelect);

    document.getElementById('changeButton').addEventListener('click', Controller.convertData);
  };

  View.displayResult = function (result) {
    var resultValue = document.getElementById('resultValue');
    resultValue.value = result;
  };

  View.ErrorBox = ErrorBox;
  return View;
});

//# sourceMappingURL=View-compiled.js.map;


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define('Service-compiled',['View-compiled'], function (View) {
  var instance = void 0;

  function get(url) {
    return new Promise(function (succeed, fail) {
      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.addEventListener('load', function () {
        if (req.status < 400) {
          succeed(req.responseText);
        } else {
          fail(new Error('Неудачно', req.statusText));
        }
      });
      req.addEventListener('error', function () {
        fail(new Error('Ошибка подключения к серверу'));
      });
      req.send(null);
    });
  }

  /**
   * класс Service, который получает данные с сервера
   */

  var Service = function () {
    function Service() {
      _classCallCheck(this, Service);

      if (!instance) {
        instance = this;
        return instance;
      }
      return instance;
    }

    _createClass(Service, [{
      key: 'getJSON',
      value: function getJSON(url, callback) {
        get(url).then(JSON.parse).then(callback, function (error) {
          var errorBox = new View.ErrorBox([error]);
          errorBox.render();
          View.ErrorBox.show();
        });
      }
    }]);

    return Service;
  }();

  return Service;
});

//# sourceMappingURL=Service-compiled.js.map;


/**
 * Параметры конфигурации
 * @type {{url}}
 */

define('CONFIG-compiled',[], function () {
  var CONFIG = Object.create(null);
  var url = {
    json: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    xml: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
  };
  CONFIG.url = url;

  return CONFIG;
});

//# sourceMappingURL=config-compiled.js.map;


define('Controller-compiled',['Model-compiled', 'Service-compiled', 'CONFIG-compiled', 'View-compiled'], function (Model, Service, CONFIG, View) {
  var Controller = Object.create(null);
  var currency = void 0;

  Controller.getData = function () {
    currency = new Model.Currencies();

    var saveToArray = function saveToArray(data) {
      for (var i = data.length - 1; i--;) {
        currency[data[i].ccy] = new Model.Currency();
        for (var j in data[i]) {
          if (j === 'base_ccy' || j === 'ccy') continue;
          currency[data[i].ccy][j] = data[i][j];
        }
      }

      Controller.renderData();
    };

    var service = new Service();
    service.getJSON(CONFIG.url.json, saveToArray);
  };

  Controller.renderData = function () {
    View.initRender(currency);
  };

  Controller.convertData = function () {
    var fields = [];
    var inputValue = document.getElementById('inputValue');
    var changeCurrency = document.getElementById('changeCurrency');
    var receiveCurrency = document.getElementById('receiveCurrency');
    var amount = Number.parseFloat(inputValue.value);

    if (!amount || Math.abs(amount) !== amount || Number.MAX_VALUE < amount) {
      fields.push(inputValue.title);
    }
    if (!changeCurrency.value) {
      fields.push(changeCurrency.title);
    }
    if (!receiveCurrency.value) {
      fields.push(receiveCurrency.title);
    }

    if (fields.length > 0) {
      var errorBox = new View.ErrorBox(fields);
      errorBox.render();
      View.ErrorBox.show();
      return;
    }

    View.displayResult(currency.convert(amount, changeCurrency.value, receiveCurrency.value));
  };

  window.Controller = Controller;
  return Controller;
});

//# sourceMappingURL=Controller-compiled.js.map;


requirejs.config({
  baseUrl: '.',
  paths: {
    'materialize': 'libs/materialize.min',
    'jquery': 'libs/jquery.min'
  },
  shim: {
    'materialize': {
      deps: ['jquery']
    },
    'jquery': {
      exports: '$'
    }
  }
});
require(['Controller-compiled'], (Controller) => {
  $(document).ready(() => {
    $('select').material_select();
    Controller.getData();
  });
});

define("index", function(){});

