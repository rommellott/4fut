'use strict';

describe('module: main, controller: Arena-detailsCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var Arena-detailsCtrl;
  beforeEach(inject(function ($controller) {
    Arena-detailsCtrl = $controller('Arena-detailsCtrl');
  }));

  it('should do something', function () {
    expect(!!Arena-detailsCtrl).toBe(true);
  });

});
