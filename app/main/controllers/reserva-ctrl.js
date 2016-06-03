'use strict';
angular.module('main')
  .controller('ReservaCtrl', function (quadras, ReservasService, $stateParams) {
    var vm = this;
    vm.quadras = quadras;
    var intervaloData = getIntervaloDia(new Date);
    vm.reservas = ReservasService.getReservasDia($stateParams.id, intervaloData.start, intervaloData.end);

    function getIntervaloDia (date) {
      var startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      var endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      return {
        start: startOfDay / 1000,
        end: endOfDay / 1000
      };
    }
  });
