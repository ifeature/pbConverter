'use strict';

/**
 * Параметры конфигурации
 * @type {{url}}
 */

var config = function () {
  var url = {
    json: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    xml: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
  };
  return {
    url: url
  };
}();

//# sourceMappingURL=config-compiled.js.map