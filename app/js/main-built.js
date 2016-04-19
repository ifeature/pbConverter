

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
  baseUrl: 'js',
  paths: {
    'materialize': '../libs/materialize/dist/js/materialize',
    'jquery': '../libs/jquery/dist/jquery'
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
require(['jquery', 'materialize', 'Controller-compiled'], function ($, materialize, Controller) {
  $(document).ready(() => {
    $('select').material_select();
    Controller.getData();
  });
});

define("index", function(){});

