"use strict";

describe('Мои тесты', function() {
  beforeEach(function() {

  });

  it('Выполняет мой первый глупый тест', () => {
    expect(true).toBeTruthy();
  });
  it('Проверяет, подключение jasmine-jquery', () => {
    var frag = setFixtures(sandbox());
    frag = $(frag);
    frag.text('Привет');
    expect(frag.text()).toBe('Привет');
  });
  it('Находит контейнер приложение', () => {
    expect($('<div id="some-id"></div>')).toEqual('div#some-id');
  });
  it('Проверяет функцию конвертации валюты', () => {
    const currency = new Model.Currencies();
    const data = {
      EUR: {
        buy: '29.50000',
        sale: '30.10000'
      },
      RUR: {
        buy: '0.37500',
        sale: '0.39000'
      },
      USD: {
        buy: '26.20000',
        sale: '26.70000'
      }
    };
    let saveToArray = function(data) {
      for (let curr in data) {
        currency[curr] = data[curr];
      }
    };
    saveToArray(data);
    expect(currency.convert(100, 'USD', 'UAH')).toEqual(2620);
    expect(currency.convert(1000, 'UAH', 'EUR')).toEqual(33.22);
  });
  it('Проверяет работу сервиса', () => {
    const service = new Service();
    spyOn(service, 'getJSON').and.callFake( () => {
      console.log('Hello');
    });
    service.getJSON();
    expect(service.getJSON).toHaveBeenCalled();
  });

});
