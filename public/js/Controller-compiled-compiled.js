'use strict';

(function () {
  let Controller, currency;
  Controller = Object.create(null);

  Controller.getData = function () {
    let i, j, service, saveToArray;
    currency = new Currencies();
    saveToArray = function (data) {
      for (i = data.length - 1; i--;) {
        currency[data[i].ccy] = new Currency();
        for (j in data[i]) {
          if (j === 'base_ccy' || j === 'ccy') continue;
          currency[data[i].ccy][j] = data[i][j];
        }
      }
      //console.log(currency);
      Controller.renderData();
    };
    service = new Service();
    service.getJSON(URL.json, saveToArray);
  };

  Controller.renderData = function () {
    View.initRender(currency);
  };

  Controller.convertData = function () {
    let inputValue, changeCurrency, receiveCurrency, resultValue, fields, errorBox;
    fields = [];
    inputValue = document.getElementById('inputValue');
    changeCurrency = document.getElementById('changeCurrency');
    receiveCurrency = document.getElementById('receiveCurrency');
    resultValue = document.getElementById('resultValue');

    if (!Number.parseInt(inputValue.value)) {
      fields.push(inputValue.title);
    }
    if (!changeCurrency.value) {
      fields.push(changeCurrency.title);
    }
    if (!receiveCurrency.value) {
      fields.push(receiveCurrency.title);
    }

    if (fields.length > 0) {
      errorBox = new View.ErrorBox(fields);
      //console.log(errorBox);
      errorBox.render();
      errorBox.show();
      return;
    }

    resultValue.value = currency.convert(Number.parseInt(inputValue.value), changeCurrency.value, receiveCurrency.value);
  };

  window.Controller = Controller;
})();

//# sourceMappingURL=Controller-compiled.js.map

//# sourceMappingURL=Controller-compiled-compiled.js.map