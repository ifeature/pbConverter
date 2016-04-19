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
require(['Controller-compiled'], (Controller) => {
  $(document).ready(() => {
    $('select').material_select();
    Controller.getData();
  });
});
