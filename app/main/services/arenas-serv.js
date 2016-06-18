'use strict';
angular.module('main')
  .factory('ArenasService', function (Ref, $firebaseArray, $firebaseObject) {
    var service = {
      getRef: getRef,
      getArenas: getArenas,
      getArena: getArena,
      getQuadrasArena: getQuadrasArena,
      getAlbum: getAlbum
      //createGeo: createGeo
    };

    return service;

    function getRef () {
      return Ref.child('arenas');
    }

    function getArena (id) {
      return $firebaseObject(getRef().child(id));
    }

    function getArenas () {
      return $firebaseArray(getRef());
    }

    function getQuadrasArena (arena) {
      return $firebaseArray(Ref.child('quadras/' + arena));
    }

    function getAlbum (arena) {
      return $firebaseArray(Ref.child('arenasAlbuns/' + arena));
    }

  });
