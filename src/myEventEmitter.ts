import {EventEmitter} from 'events';
import * as net from 'net';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

export class MyEventEmitter extends EventEmitter {
  constructor(public connection: net.Socket) {
    super();
  }
  public writeData(message: RequestType) {
    this.connection.write(`${JSON.stringify(message)}\n`);
    let wholeData = '';
    this.connection.on('data', (dataChunk) => { // This reads the server sended data
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}


