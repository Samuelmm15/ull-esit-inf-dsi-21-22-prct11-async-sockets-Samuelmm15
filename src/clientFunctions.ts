import chalk from 'chalk';
import {exit} from 'process';
import yargs from 'yargs';
import {MyEventEmitter} from './myEventEmitter';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

/**
 * This class has the different implementation
 * of the different option of the client
 */
export class ClientFunctions {
  /**
   * This is the constructor of the class
   */
  constructor() {
  }
  /**
   * This method adds new Notes to the app.
   * @param myEventEmitter Consists in the event emitter.
   */
  public addOption(myEventEmitter: MyEventEmitter) {
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
                console.log(chalk.green('The Note was succefully added.'));
              } else {
                console.log(chalk.red('There must be a problem to add the Note, please try again.'));
              }
            });
          } else {
            console.log(chalk.red('The introduced colour is wrong.'));
            exit(1); // exit with an error.
          }
        }
      },
    });
    yargs.parse();
  }
  /**
   * This method lists the content of the specified user.
   * @param myEventEmitter Consists in the event emitter.
   */
  public listOption(myEventEmitter: MyEventEmitter) {
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
          myEventEmitter.on('message', (data) => {
            if (data.success === true) {
              console.log(chalk.green('The list was succefully obtined.'));
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
              console.log(chalk.red('There must be a problem to obtain the list, please try again.'));
            }
          });
        }
      },
    });
    yargs.parse();
  }
  /**
   * This method reads the content of a specified Note.
   * @param myEventEmitter Consists in the event emitter.
   */
  public readOption(myEventEmitter: MyEventEmitter) {
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
              console.log(chalk.green('The specified Note was succefully readed.'));
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
              console.log(chalk.red('There was a problem to read the specified Note, please try again.'));
            }
          });
        }
      },
    });
    yargs.parse();
  }
  /**
   * This method removes a specified Note.
   * @param myEventEmitter Consists in the event emitter.
   */
  public removeOption(myEventEmitter: MyEventEmitter) {
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
              console.log(chalk.green('The Note was succefully removed.'));
            } else {
              console.log(chalk.red('There was a problem to remove the Note, please try again.'));
            }
          });
        }
      },
    });
    yargs.parse();
  }
  /**
   * This method modifies the body os a specified Note.
   * @param myEventEmitter Consists in the event emitter.
   */
  public modifyOption(myEventEmitter: MyEventEmitter) {
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
              console.log(chalk.green('The Note was succefully modificated.'));
            } else {
              console.log(chalk.red('There was a problem to modify the Note, please try again.'));
            }
          });
        }
      },
    });
    yargs.parse();
  }
  /**
   * This method adds new users to the system.
   * @param myEventEmitter Consists in the event emitter.
   */
  public addUserOption(myEventEmitter: MyEventEmitter) {
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
              console.log(chalk.green('The user was succefully added.'));
            } else {
              console.log(chalk.red('The user already exists.'));
            }
          });
        }
      },
    });
    yargs.parse();
  }
  /**
   * This method list the users that exists in the system.
   * @param myEventEmitter Consists in the event emitter.
   */
  public userListOption(myEventEmitter: MyEventEmitter) {
    yargs.command({
      command: 'userList',
      describe: 'List the user directorys',
      handler() {
        const message: RequestType = {type: 'userList'};
        myEventEmitter.writeData(message);
        myEventEmitter.on('message', (data) => {
          if (data.success === true) {
            console.log(chalk.green('The user list was succefully obtained.'));
            console.log();
            console.log(chalk.grey('USER LIST:'));
            for (let i = 0; i < data.users.length; i++) {
              console.log(data.users[i]);
            }
          } else {
            console.log(chalk.red('There was a problem to obtain the user list, please try again.'));
          }
        });
      },
    });
    yargs.parse();
  }
}
