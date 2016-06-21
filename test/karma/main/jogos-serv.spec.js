'use strict';

describe('module: main, service: Jogos', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Jogos;
  beforeEach(inject(function (_Jogos_) {
    Jogos = _Jogos_;
  }));

  it('should do something', function () {
    expect(!!Jogos).toBe(true);
  });

});
