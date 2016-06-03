/*global _ moment*/
'use strict';
angular.module('main')
  .controller('ReservaCtrl', function (quadras, ReservasService, $stateParams) {
    var vm = this;
    vm.intervaloSelecionado = getIntervaloDia(new Date());
    vm.horariosPorQuadra = [];
    vm.quadras = quadras;
    vm.reservas = ReservasService.getReservasDia($stateParams.id, vm.intervaloSelecionado.start, vm.intervaloSelecionado.end);

    activate();

    function activate () {
      vm.reservas.$loaded().then(getHorariosLivres);
    }

    function getHorariosLivres () {
      _.forEach(vm.quadras, function (quadra) {
        var horarios = getHorariosDia(quadra);
        vm.horariosPorQuadra.push({
          quadra: quadra,
          horarios: horarios
        });
      });
    }

    function getHorariosDia (quadra) {
      var diaSemana = moment(vm.intervaloSelecionado.start)._d.getDay() + '';
      var func = _.orderBy(_.filter(quadra.funcionamento, { dow: diaSemana }), 'start', 'asc');
      var horariosLivres = [];

      _.forEach(func, function (f) {
        var start = moment(f.start, 'hh:mm');
        var end = start.add(1, 'h');

        while (end <= moment(f.end, 'hh:mm')) {
          var horario = {
            start: start / 1,
            end: end / 1
          };

          var horarioLivre = _.every(vm.reservas, function (r) {
            return !(
                r.start === horario.start ||
                r.end === horario.end ||
                r.start < horario.start && horario.start < horario.end ||
                r.start > horario.start && horario.end > r.start
              );
          });

          if (horarioLivre) {
            horariosLivres.push(horario);
          }

          start = start.add(1, 'h');
          end = end.add(1, 'h');
        }

      });
      return horariosLivres;
    }

    function getIntervaloDia (date) {
      var startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      var endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      return {
        start: startOfDay / 1,
        end: endOfDay / 1
      };
    }

  });
