import { describe, it } from 'mocha';
import { expect } from 'chai';
import { RedisCache } from '../src';

const cache = new RedisCache({});

const key = 'key';
let value = `10`;

// test
describe('SET CACHE', () => {
  it('should be return OK', (done) => {
    cache
      .setAsync(key, value, 'EX', 20)
      .then((res) => {
        expect(res).to.equals('OK');
        done();
      })
      .catch((e) => done(e));
  });
});

describe('GET CACHE', () => {
  it('should be return expected value', (done) => {
    cache
      .getAsync(key)
      .then((res) => {
        expect(res).to.equals(value);
        done();
      })
      .catch((e) => done(e));
  });
});

describe('INSCR CACHE VALUE', () => {
  it('should be return expected value', (done) => {
    cache
      .incrByAsync(key, 1)
      .then((res) => {
        expect(res).to.equals(+value + 1);
        value = res.toString();
        done();
      })
      .catch((e) => done(e));
  });
});

describe('DESCR CACHE VALUE', () => {
  it('should be return expected value', (done) => {
    cache
      .decrByAsync(key, 1)
      .then((res) => {
        expect(res).to.equals(+value - 1);
        done();
      })
      .catch((e) => done(e));
  });
});

describe('DELEtE CACHE', () => {
  it('should be return 1', (done) => {
    cache
      .delAsync(key)
      .then((res) => {
        expect(res).to.equals(1);
        done();
      })
      .catch((e) => done(e));
  });
});
