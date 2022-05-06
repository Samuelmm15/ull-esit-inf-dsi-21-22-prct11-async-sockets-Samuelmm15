import 'mocha';
import {expect} from 'chai';
import * as net from 'net';
import {ServerFunction} from '../src/serverFunctions';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

const optionFunctions = new ServerFunction();

describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('addFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote1', body: 'This is a test', colour: 'red'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  }),
  it('addFunction() method test 2', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote1', body: 'This is a test', colour: 'red'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  }),
  it('addFunction() method test 3', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samue', title: 'newNote1', body: 'This is a test', colour: 'red'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  }),
  it('addFunction() method test 4', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote2', body: 'This is a test 2', colour: 'yellow'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  });
});
