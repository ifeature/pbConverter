'use strict';

(function () {
  class Currency {
    constructor() {}
  }

  class Currencies {
    constructor() {}

    /**
     *
     * @param amount
     * @param from
     * @param to
     * @returns {*}
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
      return result;
    }
  }

  window.Currency = Currency;
  window.Currencies = Currencies;
})();

//# sourceMappingURL=Model-compiled.js.map

//# sourceMappingURL=Model-compiled-compiled.js.map