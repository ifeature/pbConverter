'use strict';

/**
 * Модуль Модель
 * @type {{Currency, Currencies}}
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define([], function () {
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

//# sourceMappingURL=Model-compiled.js.map