# / Práctica 11 - Cliente y servidor para una aplicación de procesamiento de notas de texto

## // Índice

1. [Tareas Previa](#id1)
2. [Descripción de la aplicación](#id2)
3. [Pruebas y Testeo](#id3)
4. [Conclusión](#id4)

## // Tareas previas <a name="id1"></a>

Para comenzar con esta undécima práctica de la asignatura `Desarrollo de Sistemas Informáticos` se indican una serie de documentos que permiten conocer un poco más sobre el funcionamiento de ciertas librerías, métodos, etc, que van a ser usados para el correcto desarrollo de dicha práctica.

El primero de estos documentos es el módulo `net` de [Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/net.html). Este, permite crear servidores y clientes, que, ha su vez, hacen uso de `Sockets` para poder comunicarse entre ellos.

Por otro lado, se tiene la clase `EventEmitter` del módulo `events` de [Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/events.html#events_class_eventemitter). Esta clase, permite escuchar eventos y asignar ciertas acciones para ejecutar cuando se producen dichos eventos, pero, como se puede obervar, no se hace uso del socket para comunicarse con el servidor o el cliente, sino que se encarga de gestionar los eventos que se producen en dicho socket y añadir ciertas acciones necesarias cuando se produce un evento determinado.

Para finalizar, se sigue haciendo uso de los paquetes [yargs](https://www.npmjs.com/package/yargs) y [chalk](https://www.npmjs.com/package/chalk) para la gestión de la línea de comandos en el caso del paquete `yargs`, y, por otro lado para mostrar por pantalla mensajes con distintos aspectos y colores, en el caso de `chalk`.

## // Descripción de la aplicación <a name="id2"></a>

Para esta undécima práctica de la asignatura se solicita una aplicación de notas implantada en un servidor, y que, haciendo uso de un cliente permita que a través de la línea de comandos pueda realizar las mismas operaciones que para las usadas en la **Práctica 9** de la asignatura.

Para comenzar, se tiene la parte del servidor. En este, debe de ser implantado el funcionamiento base de la aplicación de notas original, es decir, en el servidor, todos los mensajes que sean recibidos de parte del cliente, deben de ser gestionados por este, de manera que permita realizar las operaciones que has sido solicitadas de manera física.

En primer lugar, todos los mensajes recibidos por parte del cliente, van a ser gestionados de la siguiente manera:

```
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
```

Como se puede observar anteriormente, todos los mensajes recibidos por parte del cliente, van a ser comprobados si han sido enviados de manera completa. En el caso, que alguno de los mensajes enviados se encuentre dividido en distintas partes, se realiza una concatenación del mensaje hasta el momento en el que se encuentre `\n`, con este indicador, se identifica el final del mensaje, por tanto el mensaje enviado ha sido totalmente recibido. Una vez se tiene todo esto comentado anteriormente, se activa el *flag* a *1* y se comienza con la comprobación del tipo de operación que ha sido solicitada por el cliente.

La primera de estas operaciones es la de añadir una nueva nota al directorio de cierto usuario, para ello, se hace uso de la siguiente implementación:

```
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
```

Como se puede observar, se hace uso de un switch, comprobando que en el caso de que se produzca que el mensaje recibido sea del tipo `add`, se realiza dicha operación.

La segunda de las operaciones es la de listar el contenido del directorio de un usuario en concreto.

```
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
```

Como se puede ver en el código adjunto anteriormente, por cada uno de los elementos que son obtenidos del directorio del usuario, estos, son añadidos a una colección que, cuando se produce que el directorio ya no contiene nuevos elementos los cuales pertenecen a la lista. Dicha colección es añadida al mensaje que finalmente será envíado a través del socket para que el cliente pueda aplicar las operaciones necesarias para obtener dicha lista y mostrarla directamente al cliente final.

A continuación, se implementa la operación de lectura, que, funciona de manera similar a la operación de listado de un directorio en concreto, pero, hay que tener en cuenta que, para este caso, se transmite un único elemento concreto de la lista, el cual, en la parte del cliente será tratado de tal manera que permita mostrar el contenido de la nota por consola.

```
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
```

El cuarto de los comandos implementados, es el de `remove`, este, se encarga de eliminar una nota en concreto, que se encuentra dentro del directorio de cierto usuario. Para ello, se tiene la siguiente implementación:

```
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
```

La quinta operación se encarga de modificar el contenido de una nota existente, es decir, únicamente se modifica el contenido del cuerpo de la nota.

```
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
```

A continuación se desarrollan dos comandos adicionales que permite añadir nuevos usuarios a la propia aplicación, y también listar dichos usuarios existentes dentro de esta.

Para poder añadir nuevos usuarios a la aplicación de notas:

```
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
```

En cuanto al listado de los usuarios existentes dentro de la aplicación:

```
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
```

En cuanto al cliente desarrollado para la aplicación de notas, se hace uso de una clase que permite realizar las operaciones de escritura a través del socket y, a su vez, permite obtener los mensajes que han sido transmitidos por parte del servidor, es decir, se encarga de la gestión de envío y recepción de mensajes a través del socket. Como se puede observar a continuación, se tiene la siguiente implementación:

```
class MyEventEmitter extends EventEmitter {
  constructor(public connection: net.Socket) {
    super();
  }
  public writeData(message: RequestType) {
    this.connection.write(`${JSON.stringify(message)}\n`);
    let wholeData = '';
    this.connection.on('data', (dataChunk) => {
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
```

Por otro lado, se hace uso del paquete `yargs` para poder gestionar la línea de comandos por parte del servidor, diferenciando cada uno de los comandos, y permitiendo gestionar cada uno de los mensajes enviados por parte del servidor, de manera independiente.

El primero de los comandos es el comando `add`:

```
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
```

El segundo de ellos es el comando `list`:

```
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
  };
```

A continuación, el comando `read`:

```
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
```

Para continuar, se desarrolla el comando `remove`:

```
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
```

El quinto de los comandos, es el comando `modify`:

```
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
```

Para finalizar se tienen dos comandos adicionales, que son el comando `addUser` y `userList`.

El primero de ellos es `addUser`:

```
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
```

Por último `userList`:

```
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
```

## // Testeo y Pruebas <a name="id3"></a>

Para el testeo del código desarrollado anteriormente, se hace uso del patrón callback, para poder realizar el testeo de los métodos desarrollados para las opciones por parte del servidor, dicho método para poder realizar las pruebas no ha sido empleado para los métodos de la parte del cliente, ya que, el cliente hace uso de un paquete especial llamado `yargs`. Este paquete, se encarga de administrar los comandos introducidos por la terminal, por tanto, para el testeo de dicha parte del código desarrollado, no es posible, debido a que no se pueden realizar pruebas dinámicas que requieran que el usuario introduzca los valores por teclado cada vez que el fichero que contenga la prueba sea ejecutado.

Como se puede observar en el fichero `serverFunctionTest.spec.ts`, se han desarrollado cada uno de los testeos necesarios para la correcta comprobación del código, de manera que, por cada una de las opciones de la aplicación de notas, se han realizado una serie de pruebas útiles para comprobar si realmente el código desarrollado es válido.

Por ello, para la opción `add` se tiene:

```
describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('addFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote1', body: 'This is a test', colour: 'red'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  });
  it('addFunction() method test 2', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote1', body: 'This is a test', colour: 'red'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  });
  it('addFunction() method test 3', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samue', title: 'newNote1', body: 'This is a test', colour: 'red'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  });
  it('addFunction() method test 4', (done) => {
    const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote2', body: 'This is a test 2', colour: 'yellow'};
    optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('add');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  });
});
```

Por otro lado, para la opción `list`:

```
describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('listFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'list', user: 'Samuel'};
    optionFunctions.listFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('list');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  }),
  it('listFunction() method test 2', (done) => {
    const insertedMessage: RequestType = {type: 'list', user: 'Pepe'};
    optionFunctions.listFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('list');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  });
});
```

A continuación, para la opción `read`:

```
describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('readFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'read', user: 'Samuel', title: 'newNote1'};
    optionFunctions.readFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('read');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  }),
  it('readFunction() method test 2', (done) => {
    const insertedMessage: RequestType = {type: 'read', user: 'Eduardo', title: 'newNote1'};
    optionFunctions.readFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('read');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  }),
  it('readFunction() method test 3', (done) => {
    const insertedMessage: RequestType = {type: 'read', user: 'Samuel', title: 'newNote'};
    optionFunctions.readFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('read');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  });
});
```

Para la opción `remove`:

```
describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('removeFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'remove', user: 'Samuel', title: 'newNote1'};
    optionFunctions.removeFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('remove');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  }),
  it('removeFunction() method test 2', (done) => {
    const insertedMessage: RequestType = {type: 'remove', user: 'Samue', title: 'newNote2'};
    optionFunctions.removeFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('remove');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  }),
  it('removeFunction() method test 3', (done) => {
    const insertedMessage: RequestType = {type: 'remove', user: 'Samuel', title: 'example'};
    optionFunctions.removeFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('remove');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  });
});
```

Posterior, para la opción `modify`;

```
describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('modifyFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'modify', user: 'Samuel', title: 'newNote2', body: 'This is a new body'};
    optionFunctions.modifyFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('modify');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  }),
  it('modifyFunction() method test 2', (done) => {
    const insertedMessage: RequestType = {type: 'modify', user: 'Juan', title: 'newNote2', body: 'This is a new body'};
    optionFunctions.modifyFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('modify');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  }),
  it('modifyFunction() method test 3', (done) => {
    const insertedMessage: RequestType = {type: 'modify', user: 'Samuel', title: 'newNote3', body: 'This is a new body'};
    optionFunctions.modifyFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('modify');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  });
});
```

A continuación, para la opción `addUser`:

```
describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('addUserFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'addUser', user: 'Pepe'};
    optionFunctions.addUserFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('addUser');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  }),
  it('addUserFunction() method test 2', (done) => {
    const insertedMessage: RequestType = {type: 'addUser', user: 'Samuel'};
    optionFunctions.addUserFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('addUser');
        expect(data.success).to.be.equal(false);
        done();
      }
    });
  });
});
```

Para finalizar, para la opción `userList`:

```
describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  it('userListFunction() method test 1', (done) => {
    const insertedMessage: RequestType = {type: 'userList'};
    optionFunctions.userListFunction(insertedMessage, socket, (_, data) => {
      if (data) {
        expect(data.type).to.be.equal('userList');
        expect(data.success).to.be.equal(true);
        done();
      }
    });
  });
});
```

Con todo esto anterior, tras ejecutar el cubrimiento de código, o la propia ejecución de las pruebas en Node.js, se obtiene lo siguiente:

```
> p11@1.0.0 coverage
> nyc npm test && nyc report --reporter=lcov


> p11@1.0.0 test
> mocha



  ServerFunction class tests
The file was succesfully created.
    ✔ addFunction() method test 1
The file that is trying to add already exists.
    ✔ addFunction() method test 2
The introduced path does not exists.
    ✔ addFunction() method test 3
The file was succesfully created.
    ✔ addFunction() method test 4

  ServerFunction class tests
The list was succefully sended.
    ✔ listFunction() method test 1
The User that is going to list does not exists.
    ✔ listFunction() method test 2

  ServerFunction class tests
The message was succefully sended.
    ✔ readFunction() method test 1
The introduced path does not exists.
    ✔ readFunction() method test 2
The file that was trying to read does not exists.
    ✔ readFunction() method test 3

  ServerFunction class tests
The note was succefully removed.
    ✔ removeFunction() method test 1
There must be a problem to remove.
    ✔ removeFunction() method test 2
There must be a problem to remove.
    ✔ removeFunction() method test 3

  ServerFunction class tests
The file was succesfully Modificated.
    ✔ modifyFunction() method test 1
There specified path does not exists.
    ✔ modifyFunction() method test 2
The file does not exists.
    ✔ modifyFunction() method test 3

  ServerFunction class tests
The user was succefully created.
    ✔ addUserFunction() method test 1
The user that is going to add already exists.
    ✔ addUserFunction() method test 2

  ServerFunction class tests
There must be a problem to create the user.
    1) addUserFunction() method test 2
The list was succefully sended.
    ✔ userListFunction() method test 1


  18 passing (123ms)
```

Esto se puede observar en la imagen adjunta a continuación:

![coverage-image](https://user-images.githubusercontent.com/72341631/167204109-939fce49-ab5b-492d-b021-98aa1660eb32.png)

Como se puede ver en la imagen, existe un error tras la ejecución del cubrimiento de código en este caso, este error se refiere a que se emplea muchas veces el uso del `done()` durante el desarrollo de las pruebas, no alcanzo personalmente a comprender el por qué de este error, pero cabe a destacarlo.

## // Conclusión <a name="id4"></a>

Para concluir, el desarrollo de esta práctica 11 de la asignatura, me ha permitido comprender el funcionamiento básico de los sockets, ya que, estos son la base de muchos otros métodos, librerías, etc, que utilizaremos durante el desarrollo de la asignatura, por tanto, siempre es importante comprender lo más básico como puede ser los sockets, para que, en el caso de que se genere algún error con respecto a algún aspecto de librerías o situaciones que se van a producir, pues se tiene una base sólida para poder entender y superar dicho problema.
