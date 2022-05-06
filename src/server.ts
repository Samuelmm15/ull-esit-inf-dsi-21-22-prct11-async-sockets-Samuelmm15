/* eslint-disable prefer-const */

import {ServerFunction} from './serverFunctions';
import * as net from 'net';

const server = net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('A client has connected');

  const optionFunctions = new ServerFunction();
  let wholeData = '';
  let auxiliaryMessage: string = '';
  let flag: number = 0;
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;

    let messageLimit = wholeData.indexOf('\n');
    while (messageLimit !== -1) {
      auxiliaryMessage = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);
      messageLimit = wholeData.indexOf('\n');
      flag = 1;
    }
    if (flag === 1) { // To comprobe if the message is completed sended
      const message = JSON.parse(auxiliaryMessage);
      switch (message.type) {
        case 'add':
          optionFunctions.addFunction(message, connection, (_, undefined) => {});
          connection.on('finished', (response) => {
            connection.write(`${JSON.stringify(response)}\n`);
            connection.end();
          });
          break;
        case 'list':
          optionFunctions.listFunction(message, connection, (_, undefined) => {});
          connection.on('finished', (response) => {
            connection.write(`${JSON.stringify(response)}\n`);
            connection.end();
          });
          break;
        case 'read':
          optionFunctions.readFunction(message, connection, (_, undefined) => {});
          connection.on('finished', (response) => {
            connection.write(`${JSON.stringify(response)}\n`);
            connection.end();
          });
          break;
        case 'remove':
          optionFunctions.removeFunction(message, connection, (_, undefined) => {});
          connection.on('finished', (response) => {
            connection.write(`${JSON.stringify(response)}\n`);
            connection.end();
          });
        case 'modify':
          optionFunctions.modifyFunction(message, connection, (_, undefined) => {});
          connection.on('finished', (response) => {
            connection.write(`${JSON.stringify(response)}\n`);
            connection.end();
          });
          break;
        case 'addUser':
          optionFunctions.addUserFunction(message, connection, (_, undefined) => {});
          connection.on('finished', (response) => {
            connection.write(`${JSON.stringify(response)}\n`);
            connection.end();
          });
          break;
        case 'userList':
          optionFunctions.userListFunction(message, connection, (_, undefined) => {});
          connection.on('finished', (response) => {
            connection.write(`${JSON.stringify(response)}\n`);
            connection.end();
          });
          break;
      }
    }
  });

  connection.on('close', () => {
    console.log('A client has disconnected');
  });
});

server.listen(60300, () => {
  console.log('Waiting for clientes to connect');
});


