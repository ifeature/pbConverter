'use strict';

/**
 * Параметры конфигурации
 * @type {{url}}
 */
define([], function () {
  const CONFIG = Object.create(null);
  const url = {
    json: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    xml: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'
  };
  CONFIG.url = url;

  return CONFIG;
});
