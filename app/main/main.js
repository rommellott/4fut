/*global Ionic cordova StatusBar firebase*/
/*eslint no-undef: "error"*/

'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ionic.service.analytics',
  'firebase',
  'uiGmapgoogle-maps',
  'aCarousel',
  'tmh.dynamicLocale',
  'ionic.wizard'
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
        function noop() {
        },
        function noop() {
        },
        function hasUpdate(hasUpdate) {
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

  .run(function ($state, $rootScope) {
    $rootScope.$on('$stateChangeStart', function (evt, toState) {
      var auth = firebase.auth();
      auth.onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          if (toState.name === 'login') {
            $state.go('tab.arenas');
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

  .config(function ($stateProvider, $urlRouterProvider, tmhDynamicLocaleProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('top');
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-locale-pt-br/angular-locale_pt-br.js');

    // ROUTING with ui.router
    //$urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/tab/arenas');
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html
      .state('login', {
        url: '/login',
        templateUrl: 'main/templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('wizard', {
        url: '/wizard',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>'
      })

      .state('wizard.intro', {
        url: '/intro',
        templateUrl: 'main/templates/startup-wizard.html',
        controller: 'StartupCtrl as vm',
        resolve: {
          user: ['UserService', function (UserService) {
            return UserService.getUserProfile(firebase.auth().currentUser.uid);
          }]
        }
      })

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'main/templates/tabs.html',
        controller: 'ApplicationController'
      })

      .state('tab.arenas', {
        url: '/arenas',
        views: {
          'tab.arenas': {
            templateUrl: 'main/templates/arenas-list.html',
            controller: 'ArenasCtrl as actrl'
          }
        }
      })
      .state('tab.arenas-detail', {
        url: '/arenas/:id',
        views: {
          'tab.arenas': {
            templateUrl: 'main/templates/arenas-detail.html',
            controller: 'ArenaDetailsCtrl as vm',
          }
        },
        resolve: {
          arena: ['$stateParams', 'ArenasService', function ($stateParams, ArenasService) {
            return ArenasService.getArena($stateParams.id).$loaded();
          }],
          quadras: ['$stateParams', 'ArenasService', function ($stateParams, ArenasService) {
            return ArenasService.getQuadrasArena($stateParams.id).$loaded();
          }],
          album: ['$stateParams', 'ArenasService', function ($stateParams, ArenasService) {
            return ArenasService.getAlbum($stateParams.id).$loaded();
          }]
        }
      })

      .state('tab.jogos', {
        url: '/jogos',
        views: {
          'tab-jogos': {
            templateUrl: 'main/templates/jogos.html',
            controller: 'JogosCtrl as jctr'
          }
        }
      })

      .state('tab.perfil', {
        url: '/perfil',
        views: {
          'tab-perfil': {
            templateUrl: 'main/templates/perfil.html',
            controller: 'PerfilCtrl as vm'
          }
        }
      });
  })

  .controller('ApplicationController', function ($state, $rootScope) {

    var hideTabsStates = ['tab.arenas-detail'];

    $rootScope.$on('$ionicView.beforeEnter', function () {
      $rootScope.hideTabs = ~hideTabsStates.indexOf($state.current.name);
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
