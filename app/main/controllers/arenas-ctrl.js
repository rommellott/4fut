'use strict';
angular.module('main')
  .controller('ArenasCtrl', function ($scope, arenas, Ref, $geofire, $cordovaGeolocation) {
    var vm = this;
    vm.arenas = [];

    vm.searchResults = [];

    var $geo = $geofire(Ref.child('localizacaoArenas'));

    $cordovaGeolocation.getCurrentPosition().then(loadArenas, fail);

    function loadArenas (position) {
      // Setup a GeoQuery
      var query = $geo.$query({
        center: [position.coords.latitude, position.coords.longitude],
        radius: 10
      });

      query.on('key_entered', 'SEARCH:KEY_ENTERED');

      $scope.$on('SEARCH:KEY_ENTERED', function (event, key, location, distance) {

        Ref.child('arenas').child(key).once('value', function (snapshot) {
          var arena = snapshot.val();
          arena.distance = distance;
          arena.id = key;
          vm.arenas.push(arena);
        });
        $scope.$apply();
      });
    }

    function fail (err) {
      console.log(err);
    }

  });
