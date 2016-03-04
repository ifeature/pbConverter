'use strict';

(function () {
  let instance;

  /**
   * Синглтон Service
   */
  class Service {
    constructor() {
      if (!instance) {
        instance = this;
      } else {
        return instance;
      }
    }
    getJSON(url, callback) {
      let xhr;
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
  }
  window.Service = Service;
})();

//# sourceMappingURL=Service-compiled.js.map