/*global GeoFire*/
'use strict';
angular.module('main')
  .controller('ArenasCtrl', function ($scope, Ref, $cordovaGeolocation) {
    var vm = this;
    vm.arenas = [];

    var geoFire = new GeoFire(Ref.child('localizacaoArenas'));

    $cordovaGeolocation.getCurrentPosition().then(loadArenas, fail);

    activate();

    function activate () {
    }

    function loadArenas (position) {
      vm.map = {
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        zoom: 14
      };

      // Setup a GeoQuery
      var geoQuery = geoFire.query({
        center: [position.coords.latitude, position.coords.longitude],
        radius: 10000000
      });

      geoQuery.on('key_entered', function (key, location, distance) {
        Ref.child('arenas').child(key).once('value', function (snapshot) {
          $scope.$apply(function () {
            var arena = snapshot.val();
            arena.distance = distance;
            arena.id = key;
            arena.l = { latitude: location[0], longitude: location[1]};
            vm.arenas.push(arena);
          });
        });
      });
    }

    // var $geo = $geofire(Ref.child('localizacaoArenas'));

    // $cordovaGeolocation.getCurrentPosition().then(loadArenas, fail);

    // function loadArenas (position) {
    //   // Setup a GeoQuery
    //   var query = $geo.$query({
    //     center: [position.coords.latitude, position.coords.longitude],
    //     radius: 10
    //   });

    //   query.on('key_entered', 'SEARCH:KEY_ENTERED');
    // }

    // $scope.$on('SEARCH:KEY_ENTERED', function (event, key, location, distance) {
    //   Ref.child('arenas').child(key).once('value', function (snapshot) {
    //     $scope.$apply(function () {
    //       var arena = snapshot.val();
    //       arena.distance = distance;
    //       arena.id = key;
    //       vm.arenas.push(arena);
    //     });
    //   });
    // });

    function fail (err) {
      console.log(err);
    }

  });
