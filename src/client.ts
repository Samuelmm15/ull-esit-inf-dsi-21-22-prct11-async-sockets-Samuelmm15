/* eslint-disable no-unused-vars */

import chalk from 'chalk';
import * as net from 'net';
import {exit} from 'process';
import yargs from 'yargs';
import {ClientFunctions} from './clientFunctions';
import {MyEventEmitter} from './myEventEmitter';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

const myEventEmitter = new MyEventEmitter(net.connect({port: 60300}));
const clientFunctions = new ClientFunctions();

switch (process.argv[2]) {
  case 'add':
    clientFunctions.addOption(myEventEmitter);
    break;
  case 'list':
    clientFunctions.listOption(myEventEmitter);
    break;
  case 'read':
    clientFunctions.readOption(myEventEmitter);
    break;
  case 'remove':
    clientFunctions.removeOption(myEventEmitter);
    break;
  case 'modify':
    clientFunctions.modifyOption(myEventEmitter);
    break;
  case 'addUser':
    clientFunctions.addUserOption(myEventEmitter);
    break;
  case 'userList':
    clientFunctions.userListOption(myEventEmitter);
    break;
}

