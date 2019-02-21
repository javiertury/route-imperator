'use strict';

const chai = require('chai'),
  expect = chai.expect,
  httpMethods = require('http').METHODS.concat('ALL'),
  Routes = require('../index');


describe('"loadRoutes" method', () => {

    const importRoutes = [{
      method: 'GET',
      path: '/',
      handlers: [
        function handler0 (ctx, next) { return next(); },
      ],
    }, {
      method: 'GET',
      path: '',
      handlers: [
        function handler0 (ctx, next) { return next(); },
        function handler1 (ctx, next) { return next(); },
        function handler2 (ctx, next) { return next(); },
      ],
    }, {
      method: 'POST',
      path: '/asdf/:uiop',
      handlers: [
        function handler0 (ctx, next) { return next(); },
        function handler1 (ctx, next) { return next(); },
        function handler2 (ctx, next) { return next(); },
      ],
    }, {
      method: 'POST',
      path: 'asdf/:uiop',
      handlers: [
        function handler0 (ctx, next) { return next(); },
        function handler1 (ctx, next) { return next(); },
        function handler2 (ctx, next) { return next(); },
      ],
    }, {
      method: 'POST',
      path: '/asdf/:uiop/asdf',
      handlers: [
        function handler0 (ctx, next) { return next(); },
        function handler1 (ctx, next) { return next(); },
        function handler2 (ctx, next) { return next(); },
      ],
    }];

    const onPathRoutes = [{
      method: 'GET',
      path: 'qwerty/',
      handlers: importRoutes[0].handlers,
    }, {
      method: 'GET',
      path: 'qwerty',
      handlers: importRoutes[1].handlers,
    }, {
      method: 'POST',
      path: 'qwerty/asdf/:uiop',
      handlers: importRoutes[2].handlers,
    }, {
      method: 'POST',
      path: 'qwerty/asdf/:uiop',
      handlers: importRoutes[3].handlers,
    }, {
      method: 'POST',
      path: 'qwerty/asdf/:uiop/asdf',
      handlers: importRoutes[4].handlers,
    }];

    const onRootPathRoutes = onPathRoutes.map(r => {
      return Object.assign({}, r, { path: `/${r.path}` })
    })

  it('Basic', () => {
    const routes1 = new Routes();
    const routes2 = new Routes();

    importRoutes.forEach(r => {
      routes1.on(r.method, r.path, ...r.handlers);
    });

    routes2.load(routes1);

    expect(routes1.routes).to.deep.equal(importRoutes);
    expect(routes2.routes).to.deep.equal(importRoutes);
  });

  it('Can use a path', () => {
    const routes1 = new Routes();

    importRoutes.forEach(r => {
      routes1.on(r.method, r.path, ...r.handlers);
    });

    // Mounting on path that starts with /
    const routes2 = new Routes();
    routes2.load('/qwerty', routes1);
    expect(routes2.routes).to.deep.equal(onRootPathRoutes);

    // Mounting on path that starts without /
    const routes3 = new Routes();
    routes3.load('qwerty', routes1);
    expect(routes3.routes).to.deep.equal(onPathRoutes);

    // Mounting on no path /
    const routes4 = new Routes();
    routes4.load('', routes1);
    expect(routes4.routes).to.deep.equal(importRoutes);
  });

  it('Is chainable', () => {
    const routes1 = new Routes();
    importRoutes.forEach(r => {
      routes1.on(r.method, r.path, ...r.handlers);
    });

    const routes2 = new Routes();
    const result = routes2.load(routes1);
    expect(result).to.equal(routes2);
  });
});

