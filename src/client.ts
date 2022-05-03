/* eslint-disable indent */
/**
 * TENER EN CUENTA QUE PUEDE QUE LA INFORMACIÓN RECIBIDA SEA EN CACHOS
 */

import chalk from 'chalk';
import {connect} from 'net';
import yargs from 'yargs';
import {WholeMessage} from './wholeMessage';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

const clientConnection = connect({port: 60300});
const client = new WholeMessage(clientConnection);

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
                                clientConnection.write(JSON.stringify(message));
                                clientConnection.on('data', (data) => {
                                    const dataRecieved = JSON.parse(data.toString());
                                    if (dataRecieved.success === true) {
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
                    clientConnection.write(JSON.stringify(message));
                    clientConnection.on('data', (data) => {
                        const dataRecieved = JSON.parse(data.toString());
                        if (dataRecieved.success === true) {
                            console.log(chalk.green('The list was succefully obtined'));
                            console.log();
                            console.log(chalk.grey('Files list: '));
                            for (let i = 0; i < dataRecieved.notes.length; i++) {
                                switch (dataRecieved.notes[i].colour) {
                                    case 'red':
                                        console.log(chalk.red(dataRecieved.notes[i].title));
                                    break;
                                    case 'green':
                                        console.log(chalk.green(dataRecieved.notes[i].title));
                                    break;
                                    case 'blue':
                                        console.log(chalk.blue(dataRecieved.notes[i].title));
                                    break;
                                    case 'yellow':
                                        console.log(chalk.yellow(dataRecieved.notes[i].title));
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
                    clientConnection.write(JSON.stringify(message));
                    clientConnection.end();
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
                    clientConnection.write(JSON.stringify(message));
                    clientConnection.end();
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
                    clientConnection.write(JSON.stringify(message));
                    clientConnection.end();
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
                    clientConnection.write(JSON.stringify(message));
                    clientConnection.end();
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
                clientConnection.write(JSON.stringify(message));
                clientConnection.end();
            },
        });
        yargs.parse();
        break;
}

// client.on('message', (message) => {
//     console.log(message);
// });

