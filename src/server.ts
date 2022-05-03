/* eslint-disable prefer-const */
/* eslint-disable indent */
/**
 * El cliente sólo pordrá interactuar con el servidor a través de la línea de comandos.
 * Requisitos:
 * Múltiples usuarios pueden interactuar con la aplicación
 * Nota tiene el mismo formato que anteriormente
 * Los mensajes de error e informativos deben de ser mostrados en la consola del cliente
 * Cuando se quiere leer una nota en concreto de una lista, se comprueba dicha lista y
 * si esa nota se encuentra dentro de la lista, pues se muestra el contenido, y titulo de la nota
 * en el color que ha sido creada la noa
 * Interactuación por parte del cliente a través de la línea de comandos
 * Uso del paquete yargs
 * TENER EN CUENTA QUE PUEDE QUE LA INFORMACIÓN RECIBIDA SEA EN CACHOS
 */

import * as net from 'net';
import chalk from 'chalk';
import * as fs from 'fs';
import {Note} from './note';

type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    success: boolean;
    notes?: Note[];
}

const server = net.createServer((connection) => {
    console.log('A client has connected');

    connection.on('data', (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
            case 'add':
                const object = new Note(message.title, message.body, message.colour, message.user);
                fs.readdir(`src/notes/${message.user}`, (err, data) => {
                    if (err) {
                        console.log(chalk.red('The introduced path does not exists'));
                    } else {
                    let flag: number = 1;
                    data.forEach((item) => {
                        if (item === `${message.title}.json`) {
                            flag = 0;
                        }
                    });
                    if (flag === 0) {
                        console.log(chalk.red('The file that is trying to add already exists'));
                        const response: ResponseType = {type: 'add', success: false};
                        connection.write(JSON.stringify(response));
                    } else {
                        fs.writeFile(`src/notes/${message.user}/${message.title}.json`, JSON.stringify(object), (err) => {
                            if (err) {
                                console.log(chalk.red('There must be a problem to write the file'));
                            } else {
                                console.log(chalk.green('The file was succesfully created'));
                                const response: ResponseType = {type: 'add', success: true};
                                connection.write(JSON.stringify(response));
                            }
                        });
                    }
                    }
                });
            break;
            case 'list':
                fs.readdir(`src/notes/${message.user}`, (err, data) => {
                    if (err) {
                        console.log(chalk.red('There must be a problem'));
                    } else {
                        if (data.length > 0) {
                            let noteCollection: Note[] = [];
                            data.forEach((item) => {
                                fs.readFile(`src/notes/${message.user}/${item}`, (err, readData) => {
                                    if (err) {
                                        console.log(chalk.red('There must be a problem to read'));
                                    } else {
                                        const object = JSON.parse(readData.toString());
                                        const newNote = new Note(object.title, object.body, object.colour, message.user);
                                        noteCollection.push(newNote);
                                    }
                                    if (item === data[data.length - 1]) {
                                        const response = {type: 'list', success: true, notes: noteCollection};
                                        connection.write(JSON.stringify(response));
                                    }
                                });
                                // En este punto la colleción de notas está vacía
                            });
                        } else {
                            console.log(chalk.red('There is no element in the list'));
                        }
                    }
                });
                break;
            case 'read':
                fs.readdir(`src/notes/${message.user}`, (err, data) => {
                    let flag: number = 1;
                    data.forEach((item) => {
                        if (item === `${message.title}.json`) {
                            flag = 0;
                            fs.readFile(`src/notes/${message.user}/${message.title}.json`, (err, readData) => {
                                if (err) {
                                    console.log(chalk.red('There must be a problem to read'));
                                } else {
                                    const object = JSON.parse(readData.toString());
                                    const noteObject = new Note(object.title, object.body, object.colour, message.user);
                                    const noteCollection: Note[] = [];
                                    noteCollection.push(noteObject);
                                    const response: ResponseType = {type: 'read', success: true, notes: noteCollection};
                                    connection.write(JSON.stringify(response));
                                }
                            });
                        }
                    });
                    if (flag === 1) {
                        console.log(chalk.red('The file that was trying to read does not exists'));
                        const response: ResponseType = {type: 'read', success: false};
                        connection.write(JSON.stringify(response));
                    }
                });
                break;
            case 'remove':
                break;
            case 'modify':
                break;
            case 'addUser':
                break;
            case 'userList':
                break;
        }
    });

    connection.on('close', () => {
        console.log('A client has disconnected');
    });
});

server.listen(60300, () => {
    console.log('Waiting for clientes to connect');
});
