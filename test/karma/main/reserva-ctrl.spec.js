'use strict';

describe('module: main, controller: ReservaCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ReservaCtrl;
  beforeEach(inject(function ($controller) {
    ReservaCtrl = $controller('ReservaCtrl');
  }));

  it('should do something', function () {
    expect(!!ReservaCtrl).toBe(true);
  });

});
