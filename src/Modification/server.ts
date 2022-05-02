import {spawn} from 'child_process';
import * as fs from 'fs';
import * as net from 'net';

/**
 * This is the server of the Modification
 */
const server = net.createServer((connection) => {
  console.log('A client has connected.');
  connection.write('Connection established.');
  /**
   * When the client send data to the server
   */
  connection.on('data', (data) => {
    fs.access(data.toString(), fs.constants.F_OK, (err) => {
      if (err) {
        console.log('The path obtained of the client was wrong.');
        connection.on('error', (err) => {
          console.log(err);
        });
      } else {
        const cat = spawn('cat', [data.toString()]);
        let filecontent = '';
        cat.stdout.on('data', (data) => {
          filecontent = data.toString();
        });
        cat.on('close', () => {
          console.log(filecontent);
          connection.write(JSON.stringify({'type': 'command Spawn', 'Content': filecontent}) + '\n');
          connection.end();
        });
      }
    });
  });
  /**
   * When the connection ends
   */
  connection.on('end', () => {
    console.log('Finished to send the data...');
  });
  /**
   * When the connection close
   */
  connection.on('close', () => {
    console.log('A client has disconnected');
  });
});
/**
 * To listen the port
 */
server.listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
