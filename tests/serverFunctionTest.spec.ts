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
  it('addFunction() method test', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote1', body: 'This is a test', colour: 'red'};
    // const message = JSON.parse(insertedMessage.toString());
    const socket = new net.Socket();
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  });
});
