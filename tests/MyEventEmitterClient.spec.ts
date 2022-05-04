import 'mocha';
import {expect} from 'chai';
import * as net from 'net';
import {MyEventEmitter} from '../src/myEventEmitter';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

describe('MyEventEmitter class tests', () => {
  it('Comprobation of a sended message', (done) => {
    const socket = new net.Socket();
    const requestMessage: RequestType = {type: 'add'};
    const myEventEmitter = new MyEventEmitter(socket);

    myEventEmitter.writeData(requestMessage);

    myEventEmitter.on('message', (message) => {
      expect(message).to.be.eql({"type": "add", "success": "true"});
      done();
    });

    socket.emit('data', '{"type": "add", "success": "true"}');
  });
});
