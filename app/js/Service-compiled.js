'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['View-compiled'], function (View) {
  var instance = void 0;

  function get(url) {
    return new Promise(function (succeed, fail) {
      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.addEventListener('load', function () {
        if (req.status < 400) {
          succeed(req.responseText);
        } else {
          fail(new Error('Неудачно', req.statusText));
        }
      });
      req.addEventListener('error', function () {
        fail(new Error('Ошибка подключения к серверу'));
      });
      req.send(null);
    });
  }

  /**
   * класс Service, который получает данные с сервера
   */

  var Service = function () {
    function Service() {
      _classCallCheck(this, Service);

      if (!instance) {
        instance = this;
        return instance;
      }
      return instance;
    }

    _createClass(Service, [{
      key: 'getJSON',
      value: function getJSON(url, callback) {
        get(url).then(JSON.parse).then(callback, function (error) {
          var errorBox = new View.ErrorBox([error]);
          errorBox.render();
          View.ErrorBox.show();
        });
      }
    }]);

    return Service;
  }();

  return Service;
});

//# sourceMappingURL=Service-compiled.js.map