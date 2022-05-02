import yargs from 'yargs';
import {Note} from './note';
import chalk from 'chalk';
import * as fs from 'fs';

/**
 * This is the command to add new Notes to the User directory,
 * if a existing note has the same name that a new one, the command send an
 * error message
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'User Name',
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
    if ((typeof argv.title === 'string') &&
      (typeof argv.user === 'string') &&
        (typeof argv.body === 'string') &&
          (typeof argv.colour === 'string')) {
      if ((argv.colour === 'red') || (argv.colour === 'blue') || (argv.colour === 'yellow') || (argv.colour === 'green')) {
        const object = new Note(argv.title, argv.body, argv.colour, argv.user);
        fs.readdir(`src/notes/${argv.user}`, (err, data) => {
          if (err) {
            console.log(chalk.red('There must be a problem'));
          } else {
            let flag: number = 1;
            data.forEach((item) => {
              if (item === `${argv.title}.json`) {
                flag = 0;
              }
            });
            if (flag === 0) {
              console.log(chalk.red('The file that is trying to add already exists'));
            } else {
              fs.writeFile(`src/notes/${argv.user}/${argv.title}.json`, JSON.stringify(object), (err) => {
                if (err) {
                  console.log(chalk.red('There must be a problem to write the file'));
                } else {
                  console.log(chalk.green('The file was succesfully created'));
                }
              });
            }
          }
        });
      } else {
        console.log(chalk.red('There must be a problem with the valid colours.'));
        console.log(chalk.green('The valid colours are: red, blue, yellow, green.'));
      }
    }
  },
});

/**
 * This command list the content of the user directory.
 * The list has the colour of the differents notes.
 */
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
      fs.readdir(`src/notes/${argv.user}`, (err, data) => {
        if (err) {
          console.log(chalk.red('There must be a problem'));
        } else {
          if (data.length > 0) {
            console.log(chalk.grey('Files List: '));
            data.forEach((item) => {
              fs.readFile(`src/notes/${argv.user}/${item}`, (err, readData) => {
                if (err) {
                  console.log(chalk.red('There must be a problem to read'));
                } else {
                  const object = JSON.parse(readData.toString());
                  switch (object.colour) {
                    case 'red':
                      console.log(chalk.red(item));
                      break;
                    case 'green':
                      console.log(chalk.green(item));
                      break;
                    case 'blue':
                      console.log(chalk.blue(item));
                      break;
                    case 'yellow':
                      console.log(chalk.yellow(item));
                      break;
                  }
                }
              });
            });
          } else {
            console.log(chalk.red('There is no element in the list'));
          }
        }
      });
    }
  },
});

/**
 * This command reads the content of an specific note. If a note does not
 * exists, the command send an error message.
 */
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
    if ((typeof argv.user === 'string') &&
      (typeof argv.title === 'string')) {
      fs.readdir(`src/notes/${argv.user}`, (err, data) => {
        let flag: number = 1;
        data.forEach((item) => {
          if (item === `${argv.title}.json`) {
            flag = 0;
            fs.readFile(`src/notes/${argv.user}/${argv.title}.json`, (err, readData) => {
              if (err) {
                console.log(chalk.red('There must be a problem to read'));
              } else {
                const object = JSON.parse(readData.toString());
                console.log(object.body);
              }
            });
          }
        });
        if (flag === 1) {
          console.log(chalk.red('The file that was trying to read does not exists'));
        }
      });
    }
  },
});

/**
 * This command remove an specific note of a user directory.
 */
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
    if ((typeof argv.user === 'string') &&
      (typeof argv.title === 'string')) {
      fs.unlink(`src/notes/${argv.user}/${argv.title}.json`, (err) => {
        if (err) {
          console.log(chalk.red('There must be a problem to remove'));
        } else {
          console.log(chalk.green('The note was succefully removed'));
        }
      });
    }
  },
});

/**
 * This command modify the content of an specific user note.
 */
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
      let flag: number = 1;
      fs.readdir(`src/notes/${argv.user}`, (err, data) => {
        if (err) {
          console.log(chalk.red('There must be a problem'));
        } else {
          data.forEach((item) => {
            if (item === `${argv.title}.json`) {
              flag = 0;
              fs.readFile(`src/notes/${argv.user}/${argv.title}.json`, (err, readData) => {
                if (err) {
                  console.log(chalk.red('There must be a problem to read'));
                } else {
                  const object = JSON.parse(readData.toString());
                  object.body = `${argv.body}`;
                  fs.writeFile(`src/notes/${argv.user}/${argv.title}.json`, JSON.stringify(object), (err) => {
                    if (err) {
                      console.log(chalk.red('There must be a problem to write the file'));
                    } else {
                      console.log(chalk.green('The file was succesfully Modificated'));
                    }
                  });
                }
              });
            }
          });
          if (flag === 1) {
            console.log(chalk.red('The file does not exists'));
          }
        }
      });
    }
  },
});

/**
 * This command adds new users or user directorys.
 */
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
      fs.readdir(`src/notes`, (err, data) => {
        if (err) {
          console.log(chalk.red('There must be a problem'));
        } else {
          data.forEach((item) => {
            if (item === argv.user) {
              console.log(chalk.red('The user that is going to add already exists'));
            } else {
              fs.mkdir(`src/notes/${argv.user}`, (err) => {
                if (err) {
                  console.log(chalk.red('There must be a problem to create the user'));
                } else {
                  console.log(chalk.green('The user was succefully created'));
                }
              });
            }
          });
        }
      });
    }
  },
});

/**
 * This command lists the users directorys.
 */
yargs.command({
  command: 'userList',
  describe: 'List the user directorys',
  handler() {
    fs.readdir(`src/notes`, (err, data) => {
      if (err) {
        console.log(chalk.red('There must be a problem'));
      } else {
        console.log(chalk.grey('User directory list:'));
        data.forEach((item) => {
          console.log(item);
        });
      }
    });
  },
});

yargs.parse();
