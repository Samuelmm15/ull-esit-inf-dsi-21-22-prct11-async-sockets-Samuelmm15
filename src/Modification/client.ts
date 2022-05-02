import * as net from 'net';

/**
 * This is the client of the Modification
 */
const client = net.connect({port: 60300});

/**
 * To send the data into the socket
 */
console.log('Sending the file path...');
const fileRoute = 'test.txt';
client.write(fileRoute);

/**
 * If recieve the data in different parts
 */
let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});
/**
 * If the server send an end event
 */
client.on('end', () => {
  const finalMesage = JSON.parse(wholeData);
  console.log(finalMesage.Content);
});
/**
 * If the server send an error event
 */
client.on('error', (err) => {
  console.log(err);
});
