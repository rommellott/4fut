/*global firebase */
'use strict';
angular.module('main')
  .controller('JogosCtrl', function ($scope, JogosService, $ionicModal) {
    var vm = this;
    vm.jogosRegiao = [];
    vm.modalNovoJogo = {};
    vm.modalLocais = {};
    vm.meusJogos = {};
    vm.novoJogo = {};
    vm.dateSlider = {};
    vm.dateSliderOptions = {};

    vm.salvarJogo = salvarJogo;
    vm.placeChanged = placeChanged;
    vm.openNovoJogoModal = openNovoJogoModal;
    activate();

    function activate() {
      vm.dateSliderOptions = {
        carouselId: 'carousel-1',
        align: 'left',
        selectFirst: true,
        centerOnSelect: false,
      };
      vm.dateSlider = createArray(20);

      loadJogos();
      initModals();
    }

    function loadJogos() {
      var user = firebase.auth().currentUser;
      if (user) {
        JogosService.getUserJogos(user.uid).$loaded(function (val) {
          vm.meusJogos = val;
        });
      }

      JogosService.getGeoQuery().then(function (geo) {
        vm.map = {
          center: {
            latitude: geo.center()[0],
            longitude: geo.center()[1]
          },
          zoom: 14
        };

        geo.on('key_entered', function (key, location, distance) {
          JogosService.getJogoNoSync(key).then(function (snapshot) {
            $scope.$apply(function () {
              var jogo = snapshot.val();
              jogo.distance = distance;
              jogo.id = key;
              jogo.l = { latitude: location[0], longitude: location[1] };
              vm.jogosRegiao.push(jogo);
            });
          });
        });
      });
    }

    function salvarJogo() {
      JogosService.criarJogo(vm.novoJogo, [-19.8733446, -43.93158549999998]);
    }

    function placeChanged() {
      vm.place = this.getPlace();
      vm.map.setCenter(vm.place.geometry.location);
      vm.event.location = vm.place.formatted_address;
    }

    function createArray() {
      var arr = [];

      for (var i = 0; i < 30; i++) {
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

    function initModals() {
      $ionicModal.fromTemplateUrl('/main/templates/criar-jogo.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        vm.modalNovoJogo = modal;
      });
    }

    function openNovoJogoModal() {
      vm.novoJogo = {
        minJogadores: 10,
        maxJogadores: 20
      };

      vm.jogadoresRange = {
        options: {
          floor: 0,
          ceil: 40,
          step: 1
        }
      };
      vm.modalNovoJogo.show();
    }

  });
