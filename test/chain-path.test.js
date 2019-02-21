'use strict';

const chai = require('chai'),
  expect = chai.expect,
  Routes = require('../index');

describe('chainPath util', () => {
  it('concatenates paths correctly', () => {
    expect(Routes._chainPath('/q/w/e/r/t/y/4321cba/', '/abc1234')).to.equal('/q/w/e/r/t/y/4321cba/abc1234');
    expect(Routes._chainPath('/q/w/e/r/t/y/4321cba', '/abc1234')).to.equal('/q/w/e/r/t/y/4321cba/abc1234');
    expect(Routes._chainPath('/q/w/e/r/t/y/4321cba/', 'abc1234')).to.equal('/q/w/e/r/t/y/4321cba/abc1234');
    expect(Routes._chainPath('/q/w/e/r/t/y/4321cba', 'abc1234')).to.equal('/q/w/e/r/t/y/4321cba/abc1234');

    expect(Routes._chainPath('/4321cba/', '/abc1234')).to.equal('/4321cba/abc1234');
    expect(Routes._chainPath('/4321cba', '/abc1234')).to.equal('/4321cba/abc1234');
    expect(Routes._chainPath('/4321cba/', 'abc1234')).to.equal('/4321cba/abc1234');
    expect(Routes._chainPath('/4321cba', 'abc1234')).to.equal('/4321cba/abc1234');

    expect(Routes._chainPath('/4321cba/', '/abc1234/i')).to.equal('/4321cba/abc1234/i');
    expect(Routes._chainPath('/4321cba', '/abc1234/i')).to.equal('/4321cba/abc1234/i');
    expect(Routes._chainPath('/4321cba/', 'abc1234/i')).to.equal('/4321cba/abc1234/i');
    expect(Routes._chainPath('/4321cba', 'abc1234/i')).to.equal('/4321cba/abc1234/i');
  });
});
