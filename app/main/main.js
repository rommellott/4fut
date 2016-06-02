/*global Ionic cordova StatusBar*/
/*eslint no-undef: "error"*/

'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ionic.service.analytics'
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

.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/list');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      controller: 'MenuCtrl as menu'
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
});
