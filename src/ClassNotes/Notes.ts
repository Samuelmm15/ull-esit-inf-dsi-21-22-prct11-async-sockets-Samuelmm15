// CREACIÓN DE UN SOCKET (servidor)
// import * as net from 'net';

// const server = net.createServer((conection) => { // Devuelve un objeto de tipo server
//   console.log(conection);
// });

// server.listen(60300);

// ESCRITURA DE UN SOCKET (cliente)
// import * as net from 'net';

// net.createServer((connection) => {
//   console.log('A client is connected');

//   connection.write('Connection established.'); // Este mensaje se manda al cliente

//   connection.on('close', () => { // Evento de cerrar la sesión
//     console.log('A cliente has disconnected.');
//   });
// }).listen(60300, () => {
//   console.log('Waiting for clients to connect.');
// });

/**
 * Para probar el funcionamiento del programa, se hace uso del comando `netcat`:
 * ```
 * nc localhost 60300
 * ```
 * Hay que tener en cuenta que primero se establece la conexión del servidor ejecutandolo como siempre, es decir:
 * ```
 * node dist/Notes.ts
 * ```
 * Después, en otra terminal se hace uso de:
 * ```
 * nc localhost 60300
 * ```
 */

// AÑADIENDO FUNCIONALIDAD ADICIONAL AL SERVIDOR
// import * as net from 'net';
// import {watchFile} from 'fs';

// if (process.argv.length !== 3) {
//   console.log('Please, provide a filename.');
// } else {
//   const fileName = process.argv[2];

//   net.createServer((connection) => {
//     console.log('A client has connected.');

//     connection.write(`Connection established: watching file ${fileName}.\n`); // Se tiene que pasar por línea de comandos el nombre de un fichero

//     watchFile(fileName, (curr, prev) => {
//       connection.write(`Size of file ${fileName} was ${prev.size}.\n`);
//       connection.write(`Size of file ${fileName} now is ${curr.size}.\n`);
//     });

//     connection.on('close', () => {
//       console.log('A client has disconnected.');
//     });
//   }).listen(60300, () => {
//     console.log('Waiting for clients to connect.');
//   });
// }

/**
 * Para poder esto anterior, se realiza el establecimiento del servidor, y, a continuación,
 * se conectan distintos usuarios dentro del servidor y cada vez que se produczca un cambio dentro
 * del fichero introducido, se lanza un mensaje a los clientes.
 */

// ENVÍO DE MENSAJES DE TIPO JSON A LOS CLIENTES EN VEZ DE MENSAJES SIMPLES
// import * as net from 'net';
// import {watchFile} from 'fs';

// if (process.argv.length !== 3) {
//   console.log('Please, provide a filename.');
// } else {
//   const fileName = process.argv[2];

//   net.createServer((connection) => {
//     console.log('A client has connected.');

//     connection.write(JSON.stringify({'type': 'watch', 'file': fileName}) +
//       '\n'); // En este punto en vez de mandar un mensaje de una línea de manera común, se manda un JSON con los campos type y file

//     watchFile(fileName, (curr, prev) => {
//       connection.write(JSON.stringify({
//         'type': 'change', 'prevSize': prev.size, 'currSize': curr.size}) +
//         '\n');
//     });

//     connection.on('close', () => {
//       console.log('A client has disconnected.');
//     });
//   }).listen(60300, () => {
//     console.log('Waiting for clients to connect.');
//   });
// }


// USO DE LOS SOCKETS DESDE EL PUNTO DE VISTA DEL CLIENTE
// import * as net from 'net';

// const client = net.connect({port: 60300}); // Para realizar la conexión desde el punto de vista del cliente al servidor que se encuentra ya activo

// client.on('data', (dataJSON) => { // Cuando a lo que estamos conectados emite un evento de tipo data
//   const message = JSON.parse(dataJSON.toString()); // Recepción del fichero de tipo JSON

//   if (message.type === 'watch') {
//     console.log(`Connection established: watching file ${message.file}`);
//   } else if (message.type === 'change') {
//     console.log('File has been modified.');
//     console.log(`Previous size: ${message.prevSize}`);
//     console.log(`Current size: ${message.currSize}`);
//   } else {
//     console.log(`Message type ${message.type} is not valid`);
//   }
// });

// SERVIDOR QUE ENVIA INFORMACIÓN EN TROZOS, ES DECIR, EN DISTINTOS TROZOS
// import * as net from 'net';

// const server = net.createServer((connection) => { // Esto es desde el punto de vista del servidor
//   console.log('A client has connected.');

//   const firstData = '{"type": "change", "prevSize": 13';
//   const secondData = ', "currSize": 27}\n';

//   connection.write(firstData); // Envío del primer dato

//   const timer = setTimeout(() => { // Establecimiento de una parada de tiempo
//     connection.write(secondData); // Envío del segundo dato
//     connection.end();
//   }, 500);

//   connection.on('end', () => { // Se cierra la conexión con el socket parcialmente
//     clearTimeout(timer); // Es decir, se indica que no se van a escribir más datos en el socket
//   });

//   connection.on('close', () => {
//     console.log('A client has disconnected');
//   });
// });

// server.listen(60300, () => {
//   console.log('Waiting for clients to connect.');
// });


// MODIFICACIÓN DEL CÓDIGO DEL CLIENTE INICIAL DEBIDO A EL EMPLEO DEL ENVÍO DE DATOS DIVIDIDOS POR EL SOCKET
// import * as net from 'net';

// const client = net.connect({port: 60300});

// let wholeData = '';
// client.on('data', (dataChunk) => { // Con cada emisión de un evento de tipo data, se añade el dato, a el contenido que había anteriormente
//   wholeData += dataChunk; // De esta manera todos los mensajes que envíe el servidor se irán concatenando
// });

// client.on('end', () => { // Cuando el servidor emite un evento de tipo end, es decir, que cierra parcialmente el socket
//   const message = JSON.parse(wholeData);

//   if (message.type === 'watch') {
//     console.log(`Connection established: watching file ${message.file}`);
//   } else if (message.type === 'change') {
//     console.log('File has been modified.');
//     console.log(`Previous size: ${message.prevSize}`);
//     console.log(`Current size: ${message.currSize}`);
//   } else {
//     console.log(`Message type ${message.type} is not valid`);
//   }
// });

// HERENCIA DE LA CLASE EVENTEMITTER (cliente)
// import {EventEmitter} from 'events';

// export class MessageEventEmitterClient extends EventEmitter {
//   constructor(connection: EventEmitter) { // El constructor de la clase recibe el puerto de conección
//     super();

//     let wholeData = '';
//     connection.on('data', (dataChunk) => { // Cuando el cliente recibe mensajes de tipo data
//       wholeData += dataChunk;

//       let messageLimit = wholeData.indexOf('\n'); // Todo esto a continuación permite obtener todos los mensajes que envie el servidor y unirlos de manera correcta para formar el JSON que se quería enviar
//       while (messageLimit !== -1) {
//         const message = wholeData.substring(0, messageLimit);
//         wholeData = wholeData.substring(messageLimit + 1);
//         this.emit('message', JSON.parse(message));
//         messageLimit = wholeData.indexOf('\n');
//       }
//     });
//   }
// }

// Dentro del propio cliente el cual se ha desarrollado anteriormente:
// import {connect} from 'net';
// import {MessageEventEmitterClient} from './eventEmitterClient';

// const client = new MessageEventEmitterClient(connect({port: 60300}));

// client.on('message', (message) => {
//   if (message.type === 'watch') {
//     console.log(`Connection established: watching file ${message.file}`);
//   } else if (message.type === 'change') {
//     console.log('File has been modified.');
//     console.log(`Previous size: ${message.prevSize}`);
//     console.log(`Current size: ${message.currSize}`);
//   } else {
//     console.log(`Message type ${message.type} is not valid`);
//   }
// });

// TESTEO Y PRUEBAS DE SOCKETS
// import 'mocha';
// import {expect} from 'chai';
// import {EventEmitter} from 'events';
// import {MessageEventEmitterClient} from '../src/eventEmitterClient';

// describe('MessageEventEmitterClient', () => {
//   it('Should emit a message event once it gets a complete message', (done) => {
//     const socket = new EventEmitter();
//     const client = new MessageEventEmitterClient(socket);

//     client.on('message', (message) => {
//       expect(message).to.be.eql({'type': 'change', 'prev': 13, 'curr': 26});
//       done();
//     });

//     socket.emit('data', '{"type": "change", "prev": 13');
//     socket.emit('data', ', "curr": 26}');
//     socket.emit('data', '\n');
//   });
// });
