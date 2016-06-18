/*global GeoFire*/
'use strict';
angular.module('main')
  .controller('ArenasCtrl', function ($scope, Ref, $cordovaGeolocation) {
    var vm = this;
    vm.arenas = [];

    var geoFire = new GeoFire(Ref.child('arenasLocalizacao'));

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

    function fail (err) {
      console.log(err);
    }

  });
