/*global firebase*/
/*eslint no-undef: "error"*/

'use strict';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBwDt94GlDNtX1wPKOrTMpNdZKiRSp174c',
  authDomain: 'project-6978015457201844416.firebaseapp.com',
  databaseURL: 'https://project-6978015457201844416.firebaseio.com',
  storageBucket: 'project-6978015457201844416.appspot.com',
};

// Initialize the FirebaseUI Widget using Firebase.
firebase.initializeApp(config);

angular.module('main')
  .factory('Ref', [function () {
    return firebase.database().ref();
  }]);