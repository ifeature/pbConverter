'use strict';

(function() {
  let URL = {
    json: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    xml: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
  };

  window.URL = URL;
})();
