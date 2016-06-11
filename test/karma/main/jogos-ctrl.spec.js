'use strict';

describe('module: main, controller: JogosCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var JogosCtrl;
  beforeEach(inject(function ($controller) {
    JogosCtrl = $controller('JogosCtrl');
  }));

  it('should do something', function () {
    expect(!!JogosCtrl).toBe(true);
  });

});
