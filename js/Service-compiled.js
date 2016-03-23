'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var instance = undefined;

  /**
   * Синглтон Service
   */

  var Service = function () {
    function Service() {
      _classCallCheck(this, Service);

      if (!instance) {
        instance = this;
      } else {
        return instance;
      }
    }

    _createClass(Service, [{
      key: 'getJSON',
      value: function getJSON(url, callback) {
        var xhr = undefined;
        xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function (evt) {
          callback(JSON.parse(evt.target.response));
        });
        xhr.addEventListener('error', function (evt) {
          callback(evt);
        });
        xhr.open('GET', url, true);
        xhr.send(null);
      }
    }]);

    return Service;
  }();

  window.Service = Service;
})();

//# sourceMappingURL=Service-compiled.js.map