'use strict';

describe('module: main, controller: StartupCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var StartupCtrl;
  beforeEach(inject(function ($controller) {
    StartupCtrl = $controller('StartupCtrl');
  }));

  it('should do something', function () {
    expect(!!StartupCtrl).toBe(true);
  });

});
