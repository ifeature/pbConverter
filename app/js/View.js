'use strict';

define([], function () {
  const View = Object.create(null);

  function templateHandler() {
    const templatesObj = Object.create(null);
    const importFile = document.head.querySelector('link[rel="import"]').import;
    const templates = Array.from(importFile.getElementsByTagName('template'));

    templates.forEach((template) => {
      templatesObj[template.id] = template.content.cloneNode(true);
    });

    return templatesObj;
  }

  class ErrorBox {
    constructor(invalidFields) {
      this._invaldFields = invalidFields;
      this._template = templateHandler().errorBox;
    }

    render() {
      const container = document.getElementById('pbConverter').parentElement;
      const errorBox = this._template.firstElementChild.cloneNode(true);
      const errorBoxList = errorBox.querySelector('.collection');

      while (errorBoxList.childElementCount > 0) {
        errorBoxList.removeChild(errorBoxList.children[errorBoxList.childElementCount - 1]);
      }

      this._invaldFields.forEach((field) => {
        const errorItem = this._template.getElementById('errorBoxItem').content.cloneNode(true);
        const errorItemField = errorItem.querySelector('.errorField');
        const errorItemType = errorItem.querySelector('.errorType');

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
    static show() {
      $('#modal1').openModal();
    }
    static hide() {
      $('#modal1').closeModal();
    }
  }

  View.initRender = function (currency) {
    function fillOptions(select, initialSelect, excludeOption) {
      let key;
      let option;
      let selectValue;
      const SYMBOL = {
        UAH: 'Украинская гривна',
        USD: 'Американский доллар',
        RUR: 'Российский рубль',
        EUR: 'Евро'
      };
      if (initialSelect) {
        selectValue = select.value;
        const initialSelectValue = initialSelect.value;
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

    const bindingSelect = function (evt) {
      const selectIDs = ['changeCurrency', 'receiveCurrency'];
      const currentTarget = evt.currentTarget;
      const selectedIDx = selectIDs.indexOf(currentTarget.id);

      switch (selectedIDx) {
        case 0:
          fillOptions(document.getElementById(selectIDs[1]),
            document.getElementById(selectIDs[0]),
            currentTarget.value);
          break;
        case 1:
          fillOptions(document.getElementById(selectIDs[0]),
            document.getElementById(selectIDs[1]),
            currentTarget.value);
          break;
        default:
          break;
      }
      $('select').material_select();
    };

    const pbConverter = document.getElementById('pbConverter');
    const templatesObj = templateHandler();

    fillOptions(templatesObj.changeCurrencyTemplate.getElementById('changeCurrency'));
    fillOptions(templatesObj.receiveCurrencyTemplate.getElementById('receiveCurrency'));

    pbConverter.appendChild(templatesObj.changeCurrencyTemplate);
    pbConverter.appendChild(templatesObj.receiveCurrencyTemplate);
    pbConverter.appendChild(templatesObj.controlsTemplate);

    $('select').material_select();
    $('select').on('change', bindingSelect);

    document.getElementById('changeButton').addEventListener('click', Controller.convertData);
  };

  View.displayResult = (result) => {
    const resultValue = document.getElementById('resultValue');
    resultValue.value = result;
  };

  View.ErrorBox = ErrorBox;
  return View;
});
