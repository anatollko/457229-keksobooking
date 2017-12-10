'use strict';

var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPE = ['flat', 'house', 'bungalo'];
var OFFER_TYPE_RUS = ['Квартира', 'Дом', 'Бунгало'];
var OFFER_CHECK_TIME = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
// var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

// сгенерировать индексы аватаров
var avatarIndexes = [];
var generateAvatarIndexes = function (length) {
  for (var i = 0; i < length; i++) {
    avatarIndexes[i] = '0' + (i + 1);
  }
  return avatarIndexes;
};


// сгенерировать случайное число в диапазоне bottom - top
var randomizeNumber = function (bottom, top) {
  return Math.floor((Math.random() * top) + bottom);
};


// выбрать случайное уникальное наименование из массива
var pickArrayItem = function (array) {
  var currentIndex = randomizeNumber(0, array.length);
  var arrayItem = array[currentIndex];
  array.splice(currentIndex, 1);
  return arrayItem;
};


// выбрать случайное НЕ уникальное наименование из массива
var pickAnyArrayItem = function (array) {
  var currentIndex = randomizeNumber(0, array.length);
  return array[currentIndex];
};


// перемешать массив и задать рандомную длину
var cutArrayRandomly = function (array) {
  var clonedItems = array.slice(0);
  var shuffledItems = [];
  var arrayLength = randomizeNumber(1, clonedItems.length);
  for (var i = 0; i < arrayLength; i++) {
    shuffledItems.push(pickArrayItem(clonedItems));
  }
  return shuffledItems;
};


// сгенерировать уникальный путь к аватару
generateAvatarIndexes(8);
var generateAvatarPath = function () {
  return 'img/avatars/user' + pickArrayItem(avatarIndexes) + '.png';
};


// сгенерировать координаты X и Y
var adsCoordinates = [];
var generateCoordinates = function () {
  adsCoordinates[0] = randomizeNumber(300, 900);
  adsCoordinates[1] = randomizeNumber(100, 500);
  return adsCoordinates;
};


// сгенерировать массив из 8 объявлений
var ads = [];
for (var n = 0; n < 8; n++) {
  generateCoordinates();
  ads.push({
    'author': {
      'avatar': generateAvatarPath()
    },

    'offer': {
      'title': pickArrayItem(OFFER_TITLES),
      'address': adsCoordinates[0] + ', ' + adsCoordinates[1],
      'price': randomizeNumber(1000, 1000000),
      'type': pickAnyArrayItem(OFFER_TYPE),
      'rooms': randomizeNumber(1, 5),
      'guests': randomizeNumber(1, 7),
      'checkin': pickAnyArrayItem(OFFER_CHECK_TIME),
      'checkout': pickAnyArrayItem(OFFER_CHECK_TIME),
      'features': cutArrayRandomly(OFFER_FEATURES),
      'description': '',
      'photos': []
    },

    'location': {
      'x': adsCoordinates[0],
      'y': adsCoordinates[1]
    }
  });
}


// -----------------------------------------------------------
// СОЗДАТЬ ПИНЫ
// -----------------------------------------------------------

// темплейт пина с аватаром
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

// блок для складывания пинов
var pinsSection = document.querySelector('.map__pins');


// задать пинам параметры из сгенерированных объектов
var pinRad = 23;
var pinArrowHeight = 18;
var createPin = function (array, index) {
  var pinElement = pinTemplate.cloneNode(true);

  // базовая точка пина - это центр его окружности, в то время, как пин должен указывать на координаты не своим центром, а концом своей "иголки"
  // поправка (y - (pinRad + pinArrowHeight)) учитывает расположение базовой точки и как-бы смещает ее на наконечник "иголки"
  // горизоатальная поправка не требуется, т.к. базовая точка находится на вертикальной оси пина
  pinElement.style.left = (array[index].location.x) + 'px';
  pinElement.style.top = (array[index].location.y - (pinRad + pinArrowHeight)) + 'px';
  pinElement.setAttribute('id', index);
  pinElement.querySelector('img').setAttribute('src', array[index].author.avatar);
  return pinElement;
};


// записать вновь добавленные пины во fragment
var fragment = document.createDocumentFragment();
for (var j = 0; j < ads.length; j++) {
  fragment.appendChild(createPin(ads, j));
}

// добавить fragment с пинами в разметку
var renderPins = function () {
  pinsSection.appendChild(fragment);
};


// -----------------------------------------------------------
// ВЫВЕСТИ КАРТОЧКУ С ОБЪЯВЛЕНИЕМ
// -----------------------------------------------------------

// перевести тип жилья на русский
var translateOfferType = function (entity) {
  for (var i = 0; i < 3; i++) {
    if (entity.offer.type === OFFER_TYPE[i]) {
      break;
    }
  }
  return OFFER_TYPE_RUS[i];
};


// вывести списко features в объявление
var generateFeaturesMarkup = function (entity) {
  var featuresMarkup = '';
  for (var i = 0; i < entity.offer.features.length; i++) {
    featuresMarkup += ('<li class="feature feature--' + entity.offer.features[i] + '"></li>');
  }
  return featuresMarkup;
};


// темплейт пина с аватаром
var advertTemplate = document.querySelector('template').content.querySelector('.map__card');

// блок для складывания пинов
var advertSibling = document.querySelector('.map__filters-container');
var map = document.querySelector('.map');


// задать попапу параметры из объекта
var createAdvert = function (entity) {
  var advertElement = advertTemplate.cloneNode(true);
  advertElement.querySelector('h3').textContent = entity.offer.title;
  advertElement.querySelector('p small').textContent = entity.offer.address;
  advertElement.querySelector('.popup__price').innerHTML = entity.offer.price + ' &#x20bd;/ночь';
  advertElement.querySelector('h4').textContent = translateOfferType(entity);
  advertElement.querySelector('p:nth-of-type(3)').textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';
  advertElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout;
  advertElement.querySelector('.popup__features').innerHTML = generateFeaturesMarkup(entity);
  advertElement.querySelector('p:nth-of-type(5)').textContent = entity.offer.description;
  advertElement.querySelector('.popup__avatar').setAttribute('src', entity.author.avatar);
  return advertElement;
};


// добавить объявление в разметку
var renderAdvert = function (entity) {
  map.insertBefore(createAdvert(ads[entity]), advertSibling);
};

// ------------------------------------------------------------
// ОБРАБОТЧИКИ СОБЫТИЙ
// ------------------------------------------------------------


// var genericElements = {
//   mapCard: document.querySelector('.map__card')
// };


var noticeForm = document.querySelector('.notice__form');
var mapPinMain = document.querySelector('.map__pin--main');
var fieldsets = document.querySelectorAll('fieldset');


// получить ID элемента
var getElementId = function (element) {
  return element.getAttribute('id');
};


// добавить или удалить класс у группы элементов, forEach
var modifyClassForEach = function (elementsArray, mod, className) {
  elementsArray.forEach(function (el) {
    if (mod === 'remove') {
      el.classList.remove(className);
    } else if (mod === 'add') {
      el.classList.add(className);
    }
  });
};


// сделать все инпуты неактивными disabled
modifyClassForEach(fieldsets, 'add', 'disabled');


var activatePage = function () {

  // убрать fade
  map.classList.remove('map--faded');

  // активировать форму
  noticeForm.classList.remove('notice__form--disabled');

  // убрать с инпутов класс disabled
  modifyClassForEach(fieldsets, 'remove', 'disabled');

  // создать пины и отрисовать их
  renderPins();
  makePinsClickable();
};


mapPinMain.setAttribute('tabindex', '1');


// обработчик по событию click и mouseup
mapPinMain.addEventListener('click', activatePage);
mapPinMain.addEventListener('mouseup', activatePage);


var mapCard = document.querySelector('.map__card');


// обработчик на крестик по Enter
var onEscDown = function (evt) {
  var activePin = map.querySelector('.map__pin--active');
  if (evt.keyCode === ESC_KEYCODE) {
    mapCard.remove();
    activePin.classList.remove('map__pin--active');

    document.removeEventListener('keydown', onEscDown);
  }
};


// обратиться к каждому пину
var makePinsClickable = function () {

  // переменная-селектор для псевдопинов (созданные из js)
  var mapPinItems = pinsSection.querySelectorAll('.map__pin:not(.map__pin--main)');

  mapPinItems.forEach(function (el) {

    el.setAttribute('tabindex', '1');

    // поставить обработчики на пины
    el.addEventListener('click', function () {

      // предварительно выключить везде active
      modifyClassForEach(mapPinItems, 'remove', 'map__pin--active');

      // включить active
      el.classList.add('map__pin--active');

      // убрать старое объявление
      mapCard = document.querySelector('.map__card');
      if (mapCard) {
        mapCard.remove();
      }


      var renderCardWithListeners = function () {

        // добавить новое объявление
        renderAdvert(getElementId(el));

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


// ---------------------------------------------
// ВАЛИДАЦИ ФОРМЫ
// ---------------------------------------------

var checkinTime = document.querySelector('#timein');
var checkoutTime = document.querySelector('#timeout');


// var setCheckDepedencies = function (subject) {
//   var target;
//   if (subject === checkinTime) {
//     target = checkoutTime;
//   } else if (subject === checkoutTime) {
//     target = checkinTime;
//   }
//   subject.addEventListener('change', function () {
//     for (var i = 0; i < subject.options.length; i++) {
//       var option = subject.options[i];
//       if (option.selected) {
//         target.selectedIndex = i;
//       }
//     }
//   });
// };
//
// var onCheckFocus = function (subject) {
//   subject.addEventListener('focus', setCheckDepedencies);
// };


var onCheckFocus = function (subject) {
  subject.addEventListener('focus', function () {
    var target;
    if (subject === checkinTime) {
      target = checkoutTime;
    } else if (subject === checkoutTime) {
      target = checkinTime;
    }
    subject.addEventListener('change', function () {
      for (var i = 0; i < subject.options.length; i++) {
        var option = subject.options[i];
        if (option.selected) {
          target.selectedIndex = i;
        }
      }
    });
  });
};

onCheckFocus(checkinTime);
onCheckFocus(checkoutTime);


var entityType = document.querySelector('#type');
var price = document.querySelector('#price');


var changePriceMin = function () {
  var currentIndex = entityType.selectedIndex;
  var option = entityType.options[currentIndex];

  if (option.value === 'bungalo') {
    price.setAttribute('min', '0');
  } else if (option.value === 'flat') {
    price.setAttribute('min', '1000');
  } else if (option.value === 'house') {
    price.setAttribute('min', '5000');
  } else if (option.value === 'palace') {
    price.setAttribute('min', '10000');
  }
};

var setEntityTypeDependencies = function () {
  changePriceMin();
  entityType.addEventListener('change', changePriceMin);
};


setEntityTypeDependencies();
