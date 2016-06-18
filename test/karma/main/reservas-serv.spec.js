'use strict';

describe('module: main, service: Reservas', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Reservas;
  beforeEach(inject(function (_Reservas_) {
    Reservas = _Reservas_;
  }));

  it('should do something', function () {
    expect(!!Reservas).toBe(true);
  });

});
