'use strict';

describe('module: main, controller: PerfilCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var PerfilCtrl;
  beforeEach(inject(function ($controller) {
    PerfilCtrl = $controller('PerfilCtrl');
  }));

  it('should do something', function () {
    expect(!!PerfilCtrl).toBe(true);
  });

});
