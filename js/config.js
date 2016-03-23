'use strict';

/**
 * Параметры конфигурации
 * @type {{url}}
 */
const config = (function() {
  let url = {
    json: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    xml: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
  };
  return {
    url: url
  };
})();
