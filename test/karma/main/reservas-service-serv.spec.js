'use strict';

describe('module: main, service: ReservasService', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var ReservasService;
  beforeEach(inject(function (_ReservasService_) {
    ReservasService = _ReservasService_;
  }));

  it('should do something', function () {
    expect(!!ReservasService).toBe(true);
  });

});
