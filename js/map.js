'use strict';

// ------------------------------------------------------------
// ОБРАБОТЧИКИ СОБЫТИЙ
// ------------------------------------------------------------


(function () {

  var noticeForm = document.querySelector('.notice__form');

  window.data.generateAds();

  var activatePage = function () {

    // убрать fade
    window.global.map.classList.remove('map--faded');

    // активировать форму
    noticeForm.classList.remove('notice__form--disabled');

    // убрать с инпутов класс disabled
    window.global.modifyClassForEach(window.global.fieldsets, 'remove', 'disabled');

    // создать пины и отрисовать их
    window.pin.renderPins();
    makePinsClickable();
  };


  window.global.mapPinMain.setAttribute('tabindex', '1');


  // обработчик по событию click и mouseup
  window.global.mapPinMain.addEventListener('click', activatePage);
  window.global.mapPinMain.addEventListener('mouseup', activatePage);


  var mapCard = document.querySelector('.map__card');


  // обработчик на крестик по Enter
  var onEscDown = function (evt) {
    var activePin = window.global.map.querySelector('.map__pin--active');
    if (evt.keyCode === window.global.ESC_KEYCODE) {
      mapCard.remove();
      activePin.classList.remove('map__pin--active');

      document.removeEventListener('keydown', onEscDown);
    }
  };


  // обратиться к каждому пину
  var makePinsClickable = function () {

    // переменная-селектор для псевдопинов (созданные из js)
    var mapPinItems = window.global.pinsSection.querySelectorAll('.map__pin:not(.map__pin--main)');

    mapPinItems.forEach(function (el) {

      el.setAttribute('tabindex', '1');

      // поставить обработчики на пины
      el.addEventListener('click', function () {

        // предварительно выключить везде active
        window.global.modifyClassForEach(mapPinItems, 'remove', 'map__pin--active');

        // включить active
        el.classList.add('map__pin--active');

        // убрать старое объявление
        mapCard = document.querySelector('.map__card');
        if (mapCard) {
          mapCard.remove();
        }


        var renderCardWithListeners = function () {

          // добавить новое объявление
          window.card.renderAdvert(window.global.getElementId(el));

          // объявить крестик для закрытия
          var popupClose = document.querySelector('.popup__close');
          // переобъявить card, т.к. прошлая была удалена
          mapCard = document.querySelector('.map__card');

          // обработчик на крестик по клику
          popupClose.addEventListener('click', function () {
            mapCard.remove();
            el.classList.remove('map__pin--active');
          });

          document.addEventListener('keydown', onEscDown);
        };

        renderCardWithListeners();
      });
    });
  };

})();


