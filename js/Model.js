'use strict';

/**
 * Модуль Модель
 * @type {{Currency, Currencies}}
 */
let Model = (function() {
  class Currency {
    constructor() {

    }
  }
  class Currencies {
    constructor() {

    }
    /**
     * Метод, позволяющий конвертировать один тип валюты в другой.
     * @param {number} amount Входящая сумма
     * @param {string} from Меняю
     * @param {string} to Получаю
     * @returns {number} Результирующая сумма
     */
    convert(amount, from, to) {
      let result;
      if (from !== 'UAH' && to !== 'UAH') {
        let cur1, cur2, stepOne, stepTwo;
        cur1 = from;
        cur2 = to;
        stepOne = this.convert(amount, cur1, 'UAH');
        stepTwo = this.convert(stepOne, 'UAH', cur2);
        return stepTwo;

      }
      if (from === 'UAH') {
        result = amount / this[to].sale;
      } else if (to === 'UAH') {
        result = amount * this[from].buy;
      }

      return Math.round(result * 1e2) / 1e2;
    }
  }
  return {
    Currency: Currency,
    Currencies: Currencies
  };
})();
