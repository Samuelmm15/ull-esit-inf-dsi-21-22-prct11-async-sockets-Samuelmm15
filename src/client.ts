/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/**
 * TENER EN CUENTA QUE PUEDE QUE LA INFORMACIÓN RECIBIDA SEA EN CACHOS
 */

import chalk from 'chalk';
import * as net from 'net';
import yargs from 'yargs';
import {WholeMessage} from './wholeMessage';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

// const clientConnection = connect({port: 60300});
const myEventEmitter = new WholeMessage(net.connect({port: 60300}));

switch (process.argv[2]) {
    case 'add':
        yargs.command({
            command: 'add',
            describe: 'Add a new note',
            builder: {
                user: {
                    describe: 'User Name',
                    demandOption: true,
                    type: 'string',
                },
                title: {
                    describe: 'Note title',
                    demandOption: true,
                    type: 'string',
                },
                body: {
                    describe: 'Body Note',
                    demandOption: true,
                    type: 'string',
                },
                colour: {
                    describe: 'Colour Note',
                    demandOption: true,
                    type: 'string',
                },
            },
            handler(argv) {
                if ((typeof argv.title === 'string') && (typeof argv.user === 'string') &&
                    (typeof argv.body === 'string') && (typeof argv.colour === 'string')) {
                        if ((argv.colour === 'red') || (argv.colour === 'blue') ||
                            (argv.colour === 'yellow') || (argv.colour === 'green')) {
                                const message: RequestType = {type: 'add', user: argv.user, title: argv.title,
                                    body: argv.body, colour: argv.colour};
                                myEventEmitter.writeData(message);
                                myEventEmitter.on('message', (data) => {
                                    if (data.success === true) {
                                        console.log(chalk.green('The Note was succefully added'));
                                    } else {
                                        console.log(chalk.red('The Note was not added'));
                                    }
                                });
                        }
                    }
            },
        });
        yargs.parse();
        break;
    case 'list':
        yargs.command({
            command: 'list',
            describe: 'List user title',
            builder: {
                user: {
                    describe: 'User Name',
                    demandOption: true,
                    type: 'string',
                },
            },
            handler(argv) {
                if (typeof argv.user === 'string') {
                    const message: RequestType = {type: 'list', user: argv.user};
                    myEventEmitter.writeData(message);
                    myEventEmitter.on('data', (data) => {
                        if (data.success === true) {
                            console.log(chalk.green('The list was succefully obtined'));
                            console.log();
                            console.log(chalk.grey('Files list: '));
                            for (let i = 0; i < data.notes.length; i++) {
                                switch (data.notes[i].colour) {
                                    case 'red':
                                        console.log(chalk.red(data.notes[i].title));
                                    break;
                                    case 'green':
                                        console.log(chalk.green(data.notes[i].title));
                                    break;
                                    case 'blue':
                                        console.log(chalk.blue(data.notes[i].title));
                                    break;
                                    case 'yellow':
                                        console.log(chalk.yellow(data.notes[i].title));
                                    break;
                                }
                            }
                        } else {
                            console.log(chalk.red('There was a problem to obtain the list.'));
                        }
                    });
                }
            },
        });
        yargs.parse();
        break;
    case 'read':
        yargs.command({
            command: 'read',
            describe: 'Read user title',
            builder: {
                user: {
                    describe: 'User Name',
                    demandOption: true,
                    type: 'string',
                },
                title: {
                    describe: 'Title Note',
                    demandOption: true,
                    type: 'string',
                },
            },
            handler(argv) {
                if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
                    const message: RequestType = {type: 'read', user: argv.user, title: argv.title};
                    myEventEmitter.writeData(message);
                    myEventEmitter.on('message', (data) => {
                        if (data.success === true) {
                            console.log(chalk.green('The specified file was succefully readed'));
                            console.log();
                            for (let i = 0; i < data.notes.length; i++) {
                                switch (data.notes[i].colour) {
                                    case 'red':
                                        console.log(`${data.notes[i].title}:`);
                                        console.log(chalk.red(data.notes[i].body));
                                    break;
                                    case 'green':
                                        console.log(`${data.notes[i].title}:`);
                                        console.log(chalk.green(data.notes[i].body));
                                    break;
                                    case 'blue':
                                        console.log(`${data.notes[i].title}:`);
                                        console.log(chalk.blue(data.notes[i].body));
                                    break;
                                    case 'yellow':
                                        console.log(`${data.notes[i].title}:`);
                                        console.log(chalk.yellow(data.notes[i].body));
                                    break;
                                }
                            }
                        } else {
                            console.log(chalk.red('There was a problem to read the specified file'));
                        }
                    });
                }
            },
        });
        yargs.parse();
        break;
    case 'remove':
        yargs.command({
            command: 'remove',
            describe: 'Remove user Title',
            builer: {
                user: {
                    describe: 'User Name',
                    demandOption: true,
                    type: 'string',
                },
                title: {
                    describe: 'Title Note',
                    demandOption: true,
                    type: 'string',
                },
            },
            handler(argv) {
                if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
                    const message: RequestType = {type: 'remove', user: argv.user, title: argv.title};
                    myEventEmitter.writeData(message);
                    myEventEmitter.on('message', (data) => {
                        if (data.success === true) {
                            console.log(chalk.green('The file was succefully removed'));
                        } else {
                            console.log(chalk.red('The file does not exists'));
                        }
                    });
                }
            },
        });
        yargs.parse();
        break;
    case 'modify':
        yargs.command({
            command: 'modify',
            describe: 'Modify an exist Title',
            builder: {
                user: {
                    describe: 'User Name',
                    demandOption: true,
                    type: 'string',
                },
                title: {
                    describe: 'Title Note',
                    demandOption: true,
                    type: 'string',
                },
                body: {
                    describe: 'Body Note',
                    demandOption: true,
                    type: 'string',
                },
            },
            handler(argv) {
                if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string')) {
                    const message: RequestType = {type: 'modify', user: argv.user, title: argv.title, body: argv.body};
                    myEventEmitter.writeData(message);
                    myEventEmitter.on('message', (data) => {
                        if (data.success === true) {
                            console.log(chalk.green('The File was succefully modificated'));
                        } else {
                            console.log(chalk.red('The introduced File does no exists'));
                        }
                    });
                }
            },
        });
        yargs.parse();
        break;
    case 'addUser':
        yargs.command({
            command: 'addUser',
            describe: 'Adds a new user',
            builder: {
                user: {
                    describe: 'User Name',
                    demandOption: true,
                    type: 'string',
                },
            },
            handler(argv) {
                if (typeof argv.user === 'string') {
                    const message: RequestType = {type: 'addUser', user: argv.user};
                    myEventEmitter.writeData(message);
                    myEventEmitter.on('message', (data) => {
                        if (data.success === true) {
                            console.log(chalk.green('The user was succefully added'));
                        } else {
                            console.log(chalk.red('The user already exists'));
                        }
                    });
                }
            },
        });
        yargs.parse();
        break;
    case 'userList':
        yargs.command({
            command: 'userList',
            describe: 'List the user directorys',
            handler() {
                const message: RequestType = {type: 'userList'};
                myEventEmitter.writeData(message);
                myEventEmitter.on('message', (data) => {
                    if (data.success === true) {
                        console.log(chalk.green('The user list was succefully obtained'));
                        console.log();
                        console.log(chalk.grey('USER LIST:'));
                        for (let i = 0; i < data.users.length; i++) {
                            console.log(data.users[i]);
                        }
                    } else {
                        console.log(chalk.red('There was a problem to obtain the user list'));
                    }
                });
            },
        });
        yargs.parse();
        break;
}

