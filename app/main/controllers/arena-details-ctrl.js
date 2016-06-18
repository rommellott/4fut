/*global _ moment firebase*/
'use strict';
angular.module('main')
  .controller('ArenaDetailsCtrl', function ($scope, arena, quadras, album, ReservasService, $stateParams, $ionicModal) {
    var vm = this;
    vm.arena = arena;
    vm.album = album;
    vm.intervaloSelecionado = {};
    vm.horariosPorQuadra = [];
    vm.reservas = [];
    vm.quadras = quadras;
    vm.onSelectCarousel = onSelectCarousel;
    vm.openConfirmacaoModal = openConfirmacaoModal;

    activate();

    function activate() {
      getReservas(new Date());
      vm.carouselOptions1 = {
        carouselId: 'carousel-1',
        align: 'left',
        selectFirst: true,
        centerOnSelect: false,
      };
      vm.carouselData1 = createArray(20);
      $ionicModal.fromTemplateUrl('/main/templates/confirma-reserva.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
    }

    function createArray() {
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

    function getReservas(date) {
      vm.intervaloSelecionado = getIntervaloDia(date);
      vm.reservas = ReservasService
        .getReservasDia(
        $stateParams.id,
        vm.intervaloSelecionado.start,
        vm.intervaloSelecionado.end)
        .$loaded().then(getHorariosLivres);
    }

    function onSelectCarousel(item) {
      vm.diaSelecionado = moment(item.val)._d;
      getReservas(vm.diaSelecionado);
    }

    function getHorariosLivres(reservas) {
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

    function getHorariosDia(quadra) {
      var diaSemana = moment(vm.intervaloSelecionado.start)._d.getDay() + '';
      var func = _.orderBy(_.filter(quadra.funcionamento, { dow: diaSemana }), 'start', 'asc');
      var horariosLivres = [];

      _.forEach(func, function (f) {
        var start = moment(moment(vm.intervaloSelecionado.start).format('DD/MM/YYYY') + f.start, 'DD/MM/YYYYhh:mm');
        var end = moment(moment(vm.intervaloSelecionado.start).format('DD/MM/YYYY') + f.start, 'DD/MM/YYYYhh:mm').add(1, 'h');

        while (end <= moment(moment(vm.intervaloSelecionado.start).format('DD/MM/YYYY') + f.end, 'DD/MM/YYYYhh:mm')) {
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

          if (horarioLivre && start._d >= new Date()) {
            horariosLivres.push(horario);
          }

          start.add(30, 'm');
          end.add(30, 'm');
        }

      });
      return horariosLivres;
    }

    function getIntervaloDia(date) {
      var startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      var endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      return {
        start: startOfDay / 1,
        end: endOfDay / 1
      };
    }

    function openConfirmacaoModal(horario, index) {
      vm.horarioSelecionado = horario.horarios[index];

      $scope.modalData = {
        horario: vm.horarioSelecionado,
        quadra: horario.quadra,
        duracao: 1,
        horarioExtraDisponivel: getHorarioExtraDisponivel()
      };
      $scope.SalvarReserva = function () {
        salvarNovaReserva();
      };
      $scope.modal.show();
    }

    function getHorarioExtraDisponivel() {
      var proximasReservas = _.orderBy(_.filter(vm.reservas, function (val) {
        return val.start >= vm.horarioSelecionado.end;
      }), 'start', 'asc');

      if (proximasReservas.length === 0) {
        return 2.5;
      }
      else {
        return moment.duration(moment(proximasReservas[0].start).diff(vm.horarioSelecionado.start)).asHours();
      }
    }

    function salvarNovaReserva() {
      var novaReserva = {
        tipo: 1,
        quadra: $scope.modalData.quadra.$id,
        responsavel: firebase.auth().currentUser.uid,
        start: vm.horarioSelecionado.start,
        end: moment(vm.horarioSelecionado.start).add($scope.modalData.duracao, 'h') / 1,
        saldoDevedor: $scope.modalData.horario.preco * $scope.modalData.duracao,
        saldoQuitado: 0,
        title: firebase.auth().currentUser.displayName
      };
      ReservasService.criarReservaAvulsa(novaReserva, vm.arena.$id).then(function () {
        console.log('Reserva criada com sucesso!');
        getReservas(vm.diaSelecionado);
        $scope.modal.hide();
      }, function (error) {
        console.log(error, novaReserva, 'Ops!');
      });
    }

  });

