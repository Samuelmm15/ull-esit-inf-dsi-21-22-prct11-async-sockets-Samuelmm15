import 'mocha';
import {expect} from 'chai';
import {Add} from '../src/index';

describe('Add function test', () => {
    it ('Add(1, 1) return 2', () => {
        expect(Add(1, 1)).to.be.equal(2);
    });
});