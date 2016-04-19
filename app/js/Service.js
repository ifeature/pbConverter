'use strict';

define(['View-compiled'], function (View) {
  let instance;

  function get(url) {
    return new Promise((succeed, fail) => {
      const req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.addEventListener('load', () => {
        if (req.status < 400) {
          succeed(req.responseText);
        } else {
          fail(new Error('Неудачно', req.statusText));
        }
      });
      req.addEventListener('error', () => {
        fail(new Error('Ошибка подключения к серверу'));
      });
      req.send(null);
    });
  }

  /**
   * класс Service, который получает данные с сервера
   */
  class Service {
    constructor() {
      if (!instance) {
        instance = this;
        return instance;
      }
      return instance;
    }

    getJSON(url, callback) {
      get(url).then(JSON.parse).then(callback, (error) => {
        const errorBox = new View.ErrorBox([error]);
        errorBox.render();
        View.ErrorBox.show();
      });
    }
  }

  return Service;
});
