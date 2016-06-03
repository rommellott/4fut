'use strict';

describe('module: main, service: Arenas', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Arenas;
  beforeEach(inject(function (_Arenas_) {
    Arenas = _Arenas_;
  }));

  it('should do something', function () {
    expect(!!Arenas).toBe(true);
  });

});
