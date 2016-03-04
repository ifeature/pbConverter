'use strict';

(function () {
  let View, fillOptions, bindingSelect, errorBoxTemplate;
  View = Object.create(null);

  class ErrorBox {
    constructor(invalidFields) {
      this._invaldFields = invalidFields;
      this._template = errorBoxTemplate;
    }
    render() {
      let container, errorBox, errorBoxList, errorItem, errorItemField;
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
      console.log(errorBox);
    }
    show() {
      $('#modal1').openModal();
    }
    hide() {
      $('#modal1').closeModal();
    }
  }

  View.initRender = function (currency) {
    let importFile, templates, templatesObj, pbConverter;

    fillOptions = function (select, initialSelect, excludeOption) {
      let key, option, selectValue, initialSelectValue;
      const SYMBOL = {
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

    bindingSelect = function (evt) {
      let currentTarget, selectIDs, selectedIDx;
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

  window.View = View;
  window.View.ErrorBox = ErrorBox;
})();

//# sourceMappingURL=View-compiled.js.map