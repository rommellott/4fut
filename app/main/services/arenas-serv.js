'use strict';
angular.module('main')
  .factory('ArenasService', function (Ref, $firebaseArray) {
    var service = {
      getRef: getRef,
      getArenas: getArenas,
      //createGeo: createGeo
    };

    return service;

    function getRef () {
      return Ref.child('arenas');
    }

    function getArenas () {
      return $firebaseArray(getRef());
    }

    // function createGeo () {
    //   var geo = $geofire(Ref.child('localizacaoArenas'));

    //   geo.$set('arenadoze', [-19.869271, -43.925036]);
    //   geo.$set('artbolfutebolsociety', [-19.902202, -43.955077]);
    //   geo.$set('bombonera', [-19.885405, -43.937378]);
    //   geo.$set('castrlaofc', [-19.959911, -43.960837]);

    // }

  });
