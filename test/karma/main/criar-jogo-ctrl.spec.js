'use strict';

describe('module: main, controller: Criar-jogoCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var Criar-jogoCtrl;
  beforeEach(inject(function ($controller) {
    Criar-jogoCtrl = $controller('Criar-jogoCtrl');
  }));

  it('should do something', function () {
    expect(!!Criar-jogoCtrl).toBe(true);
  });

});
