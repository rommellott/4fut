/*global Ionic cordova StatusBar firebase*/
/*eslint no-undef: "error"*/

'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ionic.service.analytics',
  'firebase',
  'uiGmapgoogle-maps'
  // TODO: load other modules selected during generation
])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      var deploy = new Ionic.Deploy();
      deploy.watch().then(
        function noop () {
        },
        function noop () {
        },
        function hasUpdate (hasUpdate) {
          console.log('Has Update ', hasUpdate);
          if (hasUpdate) {
            console.log('Calling ionicDeploy.update()');
            deploy.update().then(function (deployResult) {
              console.log(deployResult);
              // deployResult will be true when successfull and
              // false otherwise
            }, function (deployUpdateError) {
              // fired if we're unable to check for updates or if any
              // errors have occured.
              console.log('Ionic Deploy: Update error! ', deployUpdateError);
            }, function (deployProgress) {
              // this is a progress callback, so it will be called a lot
              // deployProgress will be an Integer representing the current
              // completion percentage.
              console.log('Ionic Deploy: Progress... ', deployProgress);
            });
          }
        });
    });
  })

  .run(function ($ionicPlatform, $ionicAnalytics) {
    $ionicPlatform.ready(function () {
      $ionicAnalytics.register();
    });
  })

  .run(function ($rootScope, $state) {
    // watch for login status changes and redirect if appropriate
    $rootScope.$on('$stateChangeStart', function (evt, toState) {
      var auth = firebase.auth();
      auth.onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          if (toState.name === 'login') {
            $state.go('main.arenas');
          }
        } else if (toState.name !== 'login') {
          // User is signed out.
          $state.go('login');
        }
      }, function (error) {
        console.log(error);
      });
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/login');
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html
      .state('login', {
        url: '/login',
        templateUrl: 'main/templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/templates/menu.html',
        controller: 'MenuCtrl as menu'
      })
      .state('main.arenas', {
        url: '/arenas',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/arenas-list.html',
            controller: 'ArenasCtrl as actrl'
          }
        }
      })
      .state('main.arenasDetail', {
        url: '/arenas/:id',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/arenas-detail.html',
            controller: 'Arena-detailsCtrl as adctrl',
            resolve: {
              arena: ['$stateParams', 'ArenasService', function ($stateParams, ArenasService) {
                return ArenasService.getArena($stateParams.id).$loaded();
              }]
            }
          }
        }
      })
      .state('main.reserva', {
        url: '/arenas/:id/reserva',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/reserva.html',
            controller: 'ReservaCtrl as rctrl',
            resolve: {
              quadras: ['$stateParams', 'ArenasService', function ($stateParams, ArenasService) {
                return ArenasService.getQuadrasArena($stateParams.id).$loaded();
              }]
            }
          }
        }
      })
      .state('main.list', {
        url: '/list',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/list.html',
            // controller: '<someCtrl> as ctrl'
          }
        }
      })
      .state('main.listDetail', {
        url: '/list/detail',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/list-detail.html',
            // controller: '<someCtrl> as ctrl'
          }
        }
      })
      .state('main.debug', {
        url: '/debug',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/debug.html',
            controller: 'DebugCtrl as ctrl'
          }
        }
      });
  })

  .config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
    });
  })

  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
    GoogleMapApiProviders.configure({
      brazil: true
    });
  }]);
