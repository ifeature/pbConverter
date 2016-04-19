'use strict';

/**
 * Параметры конфигурации
 * @type {{url}}
 */

define([], function () {
  var CONFIG = Object.create(null);
  var url = {
    json: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    xml: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
  };
  CONFIG.url = url;

  return CONFIG;
});

//# sourceMappingURL=config-compiled.js.map