'use strict';

define(['Model-compiled', 'Service-compiled', 'CONFIG-compiled', 'View-compiled'], function (Model, Service, CONFIG, View) {
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

//# sourceMappingURL=Controller-compiled.js.map