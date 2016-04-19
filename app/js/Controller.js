'use strict';

define(['Model-compiled', 'Service-compiled', 'CONFIG-compiled', 'View-compiled'], function (Model, Service, CONFIG, View) {
  const Controller = Object.create(null);
  let currency;

  Controller.getData = () => {
    currency = new Model.Currencies();

    const saveToArray = function (data) {
      for (let i = data.length - 1; i--;) {
        currency[data[i].ccy] = new Model.Currency();
        for (let j in data[i]) {
          if (j === 'base_ccy' || j === 'ccy') continue;
          currency[data[i].ccy][j] = data[i][j];
        }
      }

      Controller.renderData();
    };

    const service = new Service();
    service.getJSON(CONFIG.url.json, saveToArray);
  };

  Controller.renderData = function () {
    View.initRender(currency);
  };

  Controller.convertData = function () {
    const fields = [];
    const inputValue = document.getElementById('inputValue');
    const changeCurrency = document.getElementById('changeCurrency');
    const receiveCurrency = document.getElementById('receiveCurrency');
    const amount = Number.parseFloat(inputValue.value);

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
      const errorBox = new View.ErrorBox(fields);
      errorBox.render();
      View.ErrorBox.show();
      return;
    }

    View.displayResult(currency.convert(amount, changeCurrency.value, receiveCurrency.value));
  };

  window.Controller = Controller;
  return Controller;
});
