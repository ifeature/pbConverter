'use strict';

/**
 * Модуль Модель
 * @type {{Currency, Currencies}}
 */
define([], function () {
  const Model = Object.create(null);

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
        const cur1 = from;
        const cur2 = to;
        const stepOne = this.convert(amount, cur1, 'UAH');
        return this.convert(stepOne, 'UAH', cur2);
      }

      if (from === 'UAH') {
        result = amount / this[to].sale;
      } else if (to === 'UAH') {
        result = amount * this[from].buy;
      }

      return Math.round(result * 1e2) / 1e2;
    }
  }

  Model.Currency = Currency;
  Model.Currencies = Currencies;

  return Model;
});
