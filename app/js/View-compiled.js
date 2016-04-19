'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define([], function () {
  var View = Object.create(null);

  function templateHandler() {
    var templatesObj = Object.create(null);
    var importFile = document.head.querySelector('link[rel="import"]').import;
    var templates = Array.from(importFile.getElementsByTagName('template'));

    templates.forEach(function (template) {
      templatesObj[template.id] = template.content.cloneNode(true);
    });

    return templatesObj;
  }

  var ErrorBox = function () {
    function ErrorBox(invalidFields) {
      _classCallCheck(this, ErrorBox);

      this._invaldFields = invalidFields;
      this._template = templateHandler().errorBox;
    }

    _createClass(ErrorBox, [{
      key: 'render',
      value: function render() {
        var _this = this;

        var container = document.getElementById('pbConverter').parentElement;
        var errorBox = this._template.firstElementChild.cloneNode(true);
        var errorBoxList = errorBox.querySelector('.collection');

        while (errorBoxList.childElementCount > 0) {
          errorBoxList.removeChild(errorBoxList.children[errorBoxList.childElementCount - 1]);
        }

        this._invaldFields.forEach(function (field) {
          var errorItem = _this._template.getElementById('errorBoxItem').content.cloneNode(true);
          var errorItemField = errorItem.querySelector('.errorField');
          var errorItemType = errorItem.querySelector('.errorType');

          if (field.message) {
            errorItemField.innerText = field.message;
            errorItemType.innerText = '';
          } else {
            errorItemField.innerText = field;
            errorItemType.innerText = 'Неверно заполнено поле: ';
          }

          errorBoxList.appendChild(errorItem);
        });

        while (container.childElementCount > 1) {
          container.removeChild(container.children[container.childElementCount - 1]);
        }

        container.appendChild(errorBox);
      }
    }], [{
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
    function fillOptions(select, initialSelect, excludeOption) {
      var key = void 0;
      var option = void 0;
      var selectValue = void 0;
      var SYMBOL = {
        UAH: 'Украинская гривна',
        USD: 'Американский доллар',
        RUR: 'Российский рубль',
        EUR: 'Евро'
      };
      if (initialSelect) {
        selectValue = select.value;
        var initialSelectValue = initialSelect.value;
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
    }

    var bindingSelect = function bindingSelect(evt) {
      var selectIDs = ['changeCurrency', 'receiveCurrency'];
      var currentTarget = evt.currentTarget;
      var selectedIDx = selectIDs.indexOf(currentTarget.id);

      switch (selectedIDx) {
        case 0:
          fillOptions(document.getElementById(selectIDs[1]), document.getElementById(selectIDs[0]), currentTarget.value);
          break;
        case 1:
          fillOptions(document.getElementById(selectIDs[0]), document.getElementById(selectIDs[1]), currentTarget.value);
          break;
        default:
          break;
      }
      $('select').material_select();
    };

    var pbConverter = document.getElementById('pbConverter');
    var templatesObj = templateHandler();

    fillOptions(templatesObj.changeCurrencyTemplate.getElementById('changeCurrency'));
    fillOptions(templatesObj.receiveCurrencyTemplate.getElementById('receiveCurrency'));

    pbConverter.appendChild(templatesObj.changeCurrencyTemplate);
    pbConverter.appendChild(templatesObj.receiveCurrencyTemplate);
    pbConverter.appendChild(templatesObj.controlsTemplate);

    $('select').material_select();
    $('select').on('change', bindingSelect);

    document.getElementById('changeButton').addEventListener('click', Controller.convertData);
  };

  View.displayResult = function (result) {
    var resultValue = document.getElementById('resultValue');
    resultValue.value = result;
  };

  View.ErrorBox = ErrorBox;
  return View;
});

//# sourceMappingURL=View-compiled.js.map