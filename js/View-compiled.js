'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var View = undefined,
      fillOptions = undefined,
      bindingSelect = undefined,
      errorBoxTemplate = undefined;
  View = Object.create(null);

  var ErrorBox = function () {
    function ErrorBox(invalidFields) {
      _classCallCheck(this, ErrorBox);

      this._invaldFields = invalidFields;
      this._template = errorBoxTemplate;
    }

    _createClass(ErrorBox, [{
      key: 'render',
      value: function render() {
        var container = undefined,
            errorBox = undefined,
            errorBoxList = undefined,
            errorItem = undefined,
            errorItemField = undefined;
        container = document.getElementById('pbConverter').parentElement;
        errorBox = this._template.firstElementChild.cloneNode(true);
        errorBoxList = errorBox.querySelector('.collection');

        while (errorBoxList.childElementCount > 0) {
          errorBoxList.removeChild(errorBoxList.children[errorBoxList.childElementCount - 1]);
        }

        this._invaldFields.forEach(function (field) {
          errorItem = this._template.getElementById('errorBoxItem').content.cloneNode(true);
          errorItemField = errorItem.querySelector('.errorField');
          errorItemField.innerText = field;
          errorBoxList.appendChild(errorItem);
        }, this);

        while (container.childElementCount > 1) {
          container.removeChild(container.children[container.childElementCount - 1]);
        }

        container.appendChild(errorBox);
        //console.log(errorBox);
      }
    }, {
      key: 'show',
      value: function show() {
        $('#modal1').openModal();
      }
    }, {
      key: 'hide',
      value: function hide() {
        $('#modal1').closeModal();
      }
    }]);

    return ErrorBox;
  }();

  View.initRender = function (currency) {
    var importFile = undefined,
        templates = undefined,
        templatesObj = undefined,
        pbConverter = undefined;

    fillOptions = function fillOptions(select, initialSelect, excludeOption) {
      var key = undefined,
          option = undefined,
          selectValue = undefined,
          initialSelectValue = undefined;
      var SYMBOL = {
        'UAH': 'Украинская гривна',
        'USD': 'Американский доллар',
        'RUR': 'Российский рубль',
        'EUR': 'Евро'
      };
      if (initialSelect) {
        selectValue = select.value;
        initialSelectValue = initialSelect.value;
      }

      while (select.length > 0) {
        select.remove(select.length - 1);
      }

      if (!excludeOption || excludeOption !== 'UAH') {
        option = new Option('Выберите валюту', '', true, true);
        option.disabled = true;
        select.add(option);
        option = new Option(SYMBOL.UAH, 'UAH');
        select.add(option);
      }

      for (key in currency) {
        if (key === excludeOption) continue;
        option = new Option(SYMBOL[key], key);
        select.add(option);
      }
      if (initialSelect) {
        select.value = selectValue;
      }
    };

    bindingSelect = function bindingSelect(evt) {
      var currentTarget = undefined,
          selectIDs = undefined,
          selectedIDx = undefined;
      selectIDs = ['changeCurrency', 'receiveCurrency'];
      currentTarget = evt.currentTarget;
      selectedIDx = selectIDs.indexOf(currentTarget.id);
      switch (selectedIDx) {
        case 0:
          fillOptions(document.getElementById(selectIDs[1]), document.getElementById(selectIDs[0]), currentTarget.value);
          break;
        case 1:
          fillOptions(document.getElementById(selectIDs[0]), document.getElementById(selectIDs[0]), currentTarget.value);
          break;
        default:
          break;
      }
      $('select').material_select();
    };

    pbConverter = document.getElementById('pbConverter');

    templatesObj = Object.create(null);
    importFile = document.head.querySelector('link[rel="import"]').import;
    templates = Array.from(importFile.getElementsByTagName('template'));
    templates.forEach(function (template) {
      templatesObj[template.id] = template.content.cloneNode(true);
    });
    errorBoxTemplate = templatesObj['errorBox'];
    fillOptions(templatesObj['changeCurrencyTemplate'].getElementById('changeCurrency'));
    fillOptions(templatesObj['receiveCurrencyTemplate'].getElementById('receiveCurrency'));

    pbConverter.appendChild(templatesObj['changeCurrencyTemplate']);
    pbConverter.appendChild(templatesObj['receiveCurrencyTemplate']);
    pbConverter.appendChild(templatesObj['controlsTemplate']);

    $('select').material_select();
    $('select').on('change', bindingSelect);

    document.getElementById('changeButton').addEventListener('click', Controller.convertData); //???????????????
  };

  View.displayResult = function (result) {
    var resultValue = undefined;
    resultValue = document.getElementById('resultValue');
    resultValue.value = result;
  };

  window.View = View;
  window.View.ErrorBox = ErrorBox;
})();

//# sourceMappingURL=View-compiled.js.map