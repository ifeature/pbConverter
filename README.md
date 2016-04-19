# [pbConverter](http://pbconverter.ifeature.net)  
> Простой конвертер валют

[![Stories in Ready](https://badge.waffle.io/ifeature/pbConverter.svg?label=ready&title=Ready)](http://waffle.io/ifeature/pbConverter)
[![changelog][changelog-image]][changelog-url]

pbConverter - это конвертер валют по текущему курсу банка - Приватбанк.
Разработка и поддержка — [Артём](https://twitter.com/ifeature_)

Демонстрация работы — <http://pbconverter.ifeature.net>


## Поддерживаемые типы валют

* Украинская гривна (UAH)
* Российский рубль (RUR)
* Американский доллар (USD)
* Евро (EUR)

### Структура проекта

Приложение разработано согласно шаблону архитектуры MVC. Структура приложения:

```
pbConverter/
└── public/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── config.js
    │   ├── Controller.js
    │   ├── index.js
    │   ├── Model.js
    │   ├── Router.js
    │   ├── Service.js
    │   └── View.js
    └──libs/
       ├── jquery/
       └── Materialize/
```
