'use strict';
angular.module('main')
.service('Reservas', function ($log) {

  $log.log('Hello from your Service: Reservas in module main');

});
/*global _ moment $q firebase*/
'use strict';
angular.module('main')
  .factory('ReservasService', function (Ref, $firebaseArray, $q) {
    var service = {
      getRef: getRef,
      getReservasDia: getReservasDia,
      criarReservaAvulsa: criarReservaAvulsa
      //createGeo: createGeo
    };

    return service;

    function getRef() {
      return Ref.child('reservas');
    }

    function getReservasDia(arena, start, end) {
      var ref = getRef().child(arena).orderByChild('start').startAt(start).endAt(end);
      return $firebaseArray(ref);
    }

    function criarReservaAvulsa(novaReserva, arena) {
      var deferred = $q.defer();

      verificaHorarioPeriodo(novaReserva, arena).then(function (horarioValido) {

        if (horarioValido) {
          var reservaId = getRef().child(arena).push().key;
          var jogoId = Ref.child('jogos').push().key;
          var notificacaoId = Ref.child('arenasNotificacoes/' + arena).push().key;
          var reservaData = {};
          reservaData['arenasContatos/' + arena + '/' + firebase.auth().currentUser.uid] = true;
          reservaData['users/' + firebase.auth().currentUser.uid + '/reservas/' + arena + '/' + reservaId ] = true;
          reservaData['users/' + firebase.auth().currentUser.uid + '/jogos/' + jogoId ] = true;
          reservaData['jogos/' + jogoId] = {
            arena: arena,
            responsavel: firebase.auth().currentUser.uid,
            reserva: reservaId
          };
          reservaData['arenasNotificacoes/' + arena + '/' + notificacaoId] = {
            data: new Date() / 1,
            titulo: 'Nova Reserva de ' + firebase.auth().currentUser.displayName,
            msg: moment(novaReserva.start).format('[dia] DD [as] HH:mm') + ' na - Quadra 1',
            img: firebase.auth().currentUser.photoURL,
            lida: false
          };
          reservaData['reservas/' + arena + '/' + reservaId] = novaReserva;

          Ref.update(reservaData, function (error) {
            if (error) {
              deferred.reject('Erro ao cadastrar nova turma');
            }
            else {
              deferred.resolve();
            }
          });
        }
        else {
          deferred.reject('Horário Ocupado!');
        }

      });

      return deferred.promise;
    }

    function verificaHorarioPeriodo(reserva, arena) {
      var deferred = $q.defer();

      var result = true;
      var ref = getRef().child(arena)
        .orderByChild('start').startAt(moment(moment(reserva.start).format('MMDDYYYY'), 'MMDDYYYY') / 1).endAt(reserva.end);

      ref.once('value', function (data) {
        _.forEach(data.val(), function (h) {
          if (reserva.start === h.start ||
            reserva.end === h.end ||
            (reserva.start < h.start && h.start < reserva.start) ||
            (reserva.start > h.start && h.end > reserva.end)
          ) {
            result = false;
          }
        });
        deferred.resolve(result);
      });
      return deferred.promise;
    }

  });
