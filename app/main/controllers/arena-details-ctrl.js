/*global _ moment*/
'use strict';
angular.module('main')
  .controller('ArenaDetailsCtrl', function ($scope, arena, quadras, ReservasService, $stateParams) {
    var vm = this;
    vm.arena = arena;
    vm.intervaloSelecionado = {};
    vm.horariosPorQuadra = [];
    vm.quadras = quadras;
    vm.onSelectCarousel = onSelectCarousel;
    vm.reservas = [];
    vm.carouselOptions1 = {
      carouselId: 'carousel-1',
      align: 'left',
      selectFirst: true,
      centerOnSelect: false,
    };

    activate();

    function activate () {
      getReservas(new Date());
      vm.carouselData1 = createArray(20);
      console.log(vm.carouselData1);
    }

    function createArray () {
      var arr = [];

      for (var i = 0; i < 10; i++) {
        var dat = new Date();
        dat.setDate(dat.getDate() + i);

        arr.push({
          id: i,
          display: moment(dat).format('ddd') + ' ' + dat.getDate(),
          val: dat / 1
        });
      }

      return arr;
    }

    function getReservas (date) {
      vm.intervaloSelecionado = getIntervaloDia(date);
      vm.reservas = ReservasService
        .getReservasDia(
        $stateParams.id,
        vm.intervaloSelecionado.start,
        vm.intervaloSelecionado.end)
        .$loaded().then(getHorariosLivres);
    }

    function onSelectCarousel (item) {
      var date = moment(item.val)._d;
      getReservas(date);
    }

    function getHorariosLivres (reservas) {
      vm.reservas = reservas;
      vm.horariosPorQuadra = [];
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
        var end = moment(f.start, 'hh:mm').add(1, 'h');

        while (end <= moment(f.end, 'hh:mm')) {
          var horario = {
            start: start / 1,
            end: end / 1,
            preco: f.precoAvulso,
          };

          var horarioLivre = _.every(vm.reservas, function (r) {
            return !(
              r.start === horario.start ||
              r.end === horario.end ||
              r.start < horario.start && r.end > horario.start ||
              r.start > horario.start && horario.end > r.start
            );
          });

          if (horarioLivre) {
            horariosLivres.push(horario);
          }

          start.add(30, 'm');
          end.add(30, 'm');
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

