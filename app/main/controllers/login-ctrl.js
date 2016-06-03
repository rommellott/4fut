/*global firebase firebaseui*/
'use strict';
angular.module('main')
  .controller('LoginCtrl', function ($state) {

    var auth = firebase.auth();

    // FirebaseUI config.
    var uiConfig = {
      // Query parameter name for mode.
      'queryParameterForWidgetMode': 'mode',
      // Query parameter name for sign in success url.
      'queryParameterForSignInSuccessUrl': 'signInSuccessUrl',
      'signInSuccessUrl': '#/main/arenas',
      'signInOptions': [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      'tosUrl': '<your-tos-url>',
      'callbacks': {
        'signInSuccess': function () {
          $state.go('login');
          // Do something.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        }
      }
    };
    var ui = new firebaseui.auth.AuthUI(auth);
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

  });
