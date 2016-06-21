/*global */
'use strict';
angular.module('main')
  .controller('ArenasCtrl', function ($scope, ArenasService) {
    var vm = this;
    vm.arenas = [];

    activate();

    function activate() {
      loadArenas();
    }

    function loadArenas() {
      ArenasService.getGeoQuery().then(function (geo) {

        vm.map = {
          center: {
            latitude: geo.center()[0],
            longitude: geo.center()[1]
          },
          zoom: 14
        };

        geo.on('key_entered', function (key, location, distance) {
          ArenasService.getArenaNoSync(key).then(function (snapshot) {
            $scope.$apply(function () {
              var arena = snapshot.val();
              arena.distance = distance;
              arena.id = key;
              arena.l = { latitude: location[0], longitude: location[1] };
              vm.arenas.push(arena);
            });
          });
        });
      });
    }

  });
