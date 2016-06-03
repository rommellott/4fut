'use strict';

describe('module: main, controller: ArenasCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var ArenasCtrl;
  beforeEach(inject(function ($controller) {
    ArenasCtrl = $controller('ArenasCtrl');
  }));

  it('should do something', function () {
    expect(!!ArenasCtrl).toBe(true);
  });

});
