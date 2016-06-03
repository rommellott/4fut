'use strict';
angular.module('main')
  .factory('ReservasService', function (Ref, $firebaseArray) {
    var service = {
      getRef: getRef,
      getReservasDia: getReservasDia
      //createGeo: createGeo
    };

    return service;

    function getRef () {
      return Ref.child('reservas');
    }

    function getReservasDia (arena, start, end) {
      var ref = getRef().child(arena).orderByChild('start').startAt(start).endAt(end);
      return $firebaseArray(ref);
    }

  });
