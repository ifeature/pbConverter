'use strict';

requirejs.config({
  baseUrl: '.',
  paths: {
    'materialize': 'libs/materialize.min',
    'jquery': 'libs/jquery.min'
  },
  shim: {
    'materialize': {
      deps: ['jquery']
    },
    'jquery': {
      exports: '$'
    }
  }
});
require(['Controller-compiled'], function (Controller) {
  $(document).ready(function () {
    $('select').material_select();
    Controller.getData();
  });
});

//# sourceMappingURL=index-compiled.js.map