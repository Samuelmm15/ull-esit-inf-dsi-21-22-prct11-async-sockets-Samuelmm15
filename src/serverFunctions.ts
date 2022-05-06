/* eslint-disable prefer-const */
import * as net from 'net';
import chalk from 'chalk';
import * as fs from 'fs';
import {Note} from './note';

type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    success: boolean;
    notes?: Note[];
    users?: string[];
}

/**
 * This is the class that contains the implementation
 * of the option for the note aplication
 */
export class ServerFunction {
  constructor() {
  }
  /**
   * This method add a new Note.
   * @param message Consists in the message from the client.
   * @param connection Consists in the established socket from client to server.
   */
  public addFunction(message: any, connection: net.Socket, callback: (err: string | undefined, data: ResponseType | undefined) => void) {
    const object = new Note(message.title, message.body, message.colour, message.user);
    fs.readdir(`src/notes/${message.user}`, (err, data) => {
      if (err) {
        console.log(chalk.red('The introduced path does not exists.'));
        const response: ResponseType = {type: 'add', success: false};
        callback('ERROR', response);
        connection.emit('finished', response);
      } else {
        let flag: number = 1;
        data.forEach((item) => {
          if (item === `${message.title}.json`) {
            flag = 0;
          }
        });
        if (flag === 0) {
          console.log(chalk.red('The file that is trying to add already exists.'));
          const response: ResponseType = {type: 'add', success: false};
          callback('ERROR', response);
          connection.emit('finished', response);
        } else {
          fs.writeFile(`src/notes/${message.user}/${message.title}.json`, JSON.stringify(object), (err) => {
            if (err) {
              console.log(chalk.red('There must be a problem to write the file.'));
              const response: ResponseType = {type: 'add', success: false};
              callback('ERROR', response);
              connection.emit('finished', response);
            } else {
              console.log(chalk.green('The file was succesfully created.'));
              const response: ResponseType = {type: 'add', success: true};
              callback(undefined, response);
              connection.emit('finished', response);
            }
          });
        }
      }
    });
  }
  /**
   * This method list the specified user notes.
   * @param message Consists in the message from the client.
   * @param connection Consists in the established socket from client to server.
   */
  public listFunction(message: any, connection: net.Socket, callback: (err: string | undefined, data: ResponseType | undefined) => void) {
    fs.readdir(`src/notes/${message.user}`, (err, data) => {
      if (err) {
        const response: ResponseType = {type: 'list', success: false};
        console.log(chalk.red('The User that is going to list does not exists.'));
        callback('ERROR', response);
        connection.emit('finished', response);
      } else {
        if (data.length > 0) {
          let noteCollection: Note[] = [];
          data.forEach((item) => {
            fs.readFile(`src/notes/${message.user}/${item}`, (err, readData) => {
              if (err) {
                console.log(chalk.red('There must be a problem to read.'));
                const response: ResponseType = {type: 'list', success: false};
                callback('ERROR', response);
                connection.emit('finished', response);
              } else {
                const object = JSON.parse(readData.toString());
                const newNote = new Note(object.title, object.body, object.colour, message.user);
                noteCollection.push(newNote);
              }
              if (item === data[data.length - 1]) {
                const response: ResponseType = {type: 'list', success: true, notes: noteCollection};
                console.log(chalk.green('The list was succefully sended.'));
                callback(undefined, response);
                connection.emit('finished', response);
              }
            });
          });
        } else {
          console.log(chalk.red('There is no element in the list.'));
          const response: ResponseType = {type: 'list', success: false};
          callback('ERROR', response);
          connection.emit('finished', response);
        }
      }
    });
  }
  /**
   * This method reads the content of specified note.
   * @param message Consists in the message from the client.
   * @param connection Consists in the established socket from client to server.
   */
  public readFunction(message: any, connection: net.Socket, callback: (err: string | undefined, data: ResponseType | undefined) => void) {
    fs.readdir(`src/notes/${message.user}`, (err, data) => {
      if (err) {
        console.log(chalk.red('The introduced path does not exists.'));
        const response: ResponseType = {type: 'read', success: false};
        callback('ERROR', response);
        connection.emit('finished', response);
      } else {
        let flag: number = 1;
        data.forEach((item) => {
          if (item === `${message.title}.json`) {
            flag = 0;
            fs.readFile(`src/notes/${message.user}/${message.title}.json`, (err, readData) => {
              if (err) {
                console.log(chalk.red('There must be a problem to read.'));
                const response: ResponseType = {type: 'read', success: false};
                callback('ERROR', response);
                connection.emit('finished', response);
              } else {
                const object = JSON.parse(readData.toString());
                const noteObject = new Note(object.title, object.body, object.colour, message.user);
                const noteCollection: Note[] = [];
                noteCollection.push(noteObject);
                const response: ResponseType = {type: 'read', success: true, notes: noteCollection};
                console.log(chalk.green('The message was succefully sended.'));
                callback(undefined, response);
                connection.emit('finished', response);
              }
            });
          }
        });
        if (flag === 1) {
          console.log(chalk.red('The file that was trying to read does not exists.'));
          const response: ResponseType = {type: 'read', success: false};
          callback('ERROR', response);
          connection.emit('finished', response);
        }
      }
    });
  }
  /**
   * This method removed a specified note from the list.
   * @param message Consists in the message from the client.
   * @param connection Consists in the established socket from client to server.
   */
  public removeFunction(message: any, connection: net.Socket, callback: (err: string | undefined, data: ResponseType | undefined) => void) {
    fs.unlink(`src/notes/${message.user}/${message.title}.json`, (err) => {
      if (err) {
        console.log(chalk.red('There must be a problem to remove.'));
        const response: ResponseType = {type: 'remove', success: false};
        callback('ERROR', response);
        connection.emit('finished', response);
      } else {
        console.log(chalk.green('The note was succefully removed.'));
        const response: ResponseType = {type: 'remove', success: true};
        callback(undefined, response);
        connection.emit('finished', response);
      }
    });
  }
  /**
   * This method modify the body of a specified note.
   * @param message  Consists in the message from the client.
   * @param connection Consists in the established socket from client to server.
   */
  public modifyFunction(message: any, connection: net.Socket, callback: (err: string | undefined, data: ResponseType | undefined) => void) {
    let flag: number = 1;
    fs.readdir(`src/notes/${message.user}`, (err, data) => {
      if (err) {
        console.log(chalk.red('There specified path does not exists.'));
        const response: ResponseType = {type: 'modify', success: false};
        callback('ERROR', response);
        connection.emit('finished', response);
      } else {
        data.forEach((item) => {
          if (item === `${message.title}.json`) {
            flag = 0;
            fs.readFile(`src/notes/${message.user}/${message.title}.json`, (err, readData) => {
              if (err) {
                console.log(chalk.red('There must be a problem to read.'));
                const response: ResponseType = {type: 'modify', success: false};
                callback('ERROR', response);
                connection.emit('finished', response);
              } else {
                const object = JSON.parse(readData.toString());
                object.body = `${message.body}`;
                fs.writeFile(`src/notes/${message.user}/${message.title}.json`, JSON.stringify(object), (err) => {
                  if (err) {
                    console.log(chalk.red('There must be a problem to write the file.'));
                    const response: ResponseType = {type: 'modify', success: false};
                    callback('ERROR', response);
                    connection.emit('finished', response);
                  } else {
                    console.log(chalk.green('The file was succesfully Modificated.'));
                    const response: ResponseType = {type: 'modify', success: true};
                    callback(undefined, response);
                    connection.emit('finished', response);
                  }
                });
              }
            });
          }
        });
        if (flag === 1) {
          console.log(chalk.red('The file does not exists.'));
          const response: ResponseType = {type: 'modify', success: false};
          callback('ERROR', response);
          connection.emit('finished', response);
        }
      }
    });
  }
  /**
   * This method adds users to the aplication.
   * @param message Consists in the message from the client.
   * @param connection Consists in the established socket from client to server.
   */
  public addUserFunction(message: any, connection: net.Socket, callback: (err: string | undefined, data: ResponseType | undefined) => void) {
    fs.readdir(`src/notes`, (err, data) => {
      if (err) {
        console.log(chalk.red('There must be a problem.'));
        const response: ResponseType = {type: 'addUser', success: false};
        callback('ERROR', response);
        connection.emit('finished', response);
      } else {
        data.forEach((item) => {
          if (item === message.user) {
            console.log(chalk.red('The user that is going to add already exists.'));
            const response: ResponseType = {type: 'addUser', success: false};
            callback('ERROR', response);
            connection.emit('finished', response);
          } else {
            fs.mkdir(`src/notes/${message.user}`, (err) => {
              if (err) {
                console.log(chalk.red('There must be a problem to create the user.'));
                const response: ResponseType = {type: 'addUser', success: false};
                callback('ERROR', response);
                connection.emit('finished', response);
              } else {
                console.log(chalk.green('The user was succefully created.'));
                const response: ResponseType = {type: 'addUser', success: true};
                callback(undefined, response);
                connection.emit('finished', response);
              }
            });
          }
        });
      }
    });
  }
  /**
   * This method list the users from the system.
   * @param message Consists in the message from the client.
   * @param connection Consists in the established socket from client to server.
   */
  public userListFunction(message: any, connection: net.Socket, callback: (err: string | undefined, data: ResponseType | undefined) => void) {
    fs.readdir(`src/notes`, (err, data) => {
      if (err) {
        console.log(chalk.red('There must be a problem.'));
        const response: ResponseType = {type: 'userList', success: false};
        callback('ERROR', response);
        connection.emit('finished', response);
      } else {
        let userCollection: string[] = [];
        data.forEach((item) => {
          userCollection.push(item);
          if (item === data[data.length - 1]) {
            const response: ResponseType = {type: 'userList', success: true, users: userCollection};
            console.log(chalk.green('The list was succefully sended.'));
            callback(undefined, response);
            connection.emit('finished', response);
          }
        });
      }
    });
  }
}
