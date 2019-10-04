const { capacitor } = require('..');
const { expect }    = require('chai');

describe('Capacitor', () => {

  it('Triggers an action every X messages', () => {
    let count = 0;
    let cptor = capacitor(5, () => { count++ });
    let [push] =  cptor;

    for (let i = 0; i < 13; ++i) { push(i); }

    expect(count).to.equal(2);
    expect(cptor.charges).to.equal(3);
  });

  it('Passes the last X records to the trigger', () => {
    let count = 0;
    let [push] = capacitor(3, (msgs) => {
      expect(msgs[0]).to.equal(count * 3)
      expect(msgs[1]).to.equal(count * 3 + 1)
      expect(msgs[2]).to.equal(count * 3 + 2)
      count++;
    });

    for (let i = 0; i < 7; ++i) { push(i); }

    expect(count).to.equal(2);
  });

  it('Supports timeouts of inactivity', (done) => {
    let count = 0;
    let [push] = capacitor(3, () => count++).unstable(100);

    push(1);
    push(2);
    push(3);
    push(4);
    expect(count).to.equal(1);

    setTimeout(() => {
      expect(count).to.equal(2);
      push(5);
      expect(count).to.equal(2);
      setTimeout(() => {
        expect(count).to.equal(3);
        done();
      }, 200)
    }, 200);
  });

  it('Doesnt fire timeouts when charges are at 0', (done) => {
    let count = 0;
    let cptor = capacitor(3, () => count++).unstable(100);
    let [push] = cptor;

    push(1);
    push(2);
    push(3);
    expect(cptor.charges).to.equal(0);
    expect(count).to.equal(1);

    setTimeout(() => {
      expect(count).to.equal(1);
      push(5);
      expect(cptor.charges).to.equal(1);
      setTimeout(() => {
        expect(count).to.equal(2);
        expect(cptor.charges).to.equal(0);
        done();
      }, 200)
    }, 200);
  });

  it('Provides methods both as array items and properties', () => {
    let cptor = capacitor(3, () => {});
    let [charge, invalidate, trigger] = cptor;

    expect(cptor.charge).to.equal(charge);
    expect(cptor.invalidate).to.equal(invalidate);
    expect(cptor.trigger).to.equal(trigger);
  });
});
