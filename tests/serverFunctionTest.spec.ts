import 'mocha';
import {expect} from 'chai';
import * as net from 'net';
import {ServerFunction} from '../src/serverFunctions';

type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'addUser' | 'userList';
    user?: string;
    title?: string;
    body?: string;
    colour?: string;
}

const optionFunctions = new ServerFunction();

describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  // it('addFunction() method test 1', (done) => {
  //   const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote1', body: 'This is a test', colour: 'red'};
  //   optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
  //     if (data) {
  //       expect(data.type).to.be.equal('add');
  //       expect(data.success).to.be.equal(true);
  //       done();
  //     }
  //   });
  // });
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
  // it('addFunction() method test 4', (done) => {
  //   const insertedMessage: RequestType = {type: 'add', user: 'Samuel', title: 'newNote2', body: 'This is a test 2', colour: 'yellow'};
  //   optionFunctions.addFunction(insertedMessage, socket, (_, data) => {
  //     if (data) {
  //       expect(data.type).to.be.equal('add');
  //       expect(data.success).to.be.equal(true);
  //       done();
  //     }
  //   });
  // });
});

describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  // it('listFunction() method test 1', (done) => {
  //   const insertedMessage: RequestType = {type: 'list', user: 'Samuel'};
  //   optionFunctions.listFunction(insertedMessage, socket, (_, data) => {
  //     if (data) {
  //       expect(data.type).to.be.equal('list');
  //       expect(data.success).to.be.equal(true);
  //       done();
  //     }
  //   });
  // }),
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

describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  // it('readFunction() method test 1', (done) => {
  //   const insertedMessage: RequestType = {type: 'read', user: 'Samuel', title: 'newNote1'};
  //   optionFunctions.readFunction(insertedMessage, socket, (_, data) => {
  //     if (data) {
  //       expect(data.type).to.be.equal('read');
  //       expect(data.success).to.be.equal(true);
  //       done();
  //     }
  //   });
  // }),
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

describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  // it('removeFunction() method test 1', (done) => {
  //   const insertedMessage: RequestType = {type: 'remove', user: 'Samuel', title: 'newNote1'};
  //   optionFunctions.removeFunction(insertedMessage, socket, (_, data) => {
  //     if (data) {
  //       expect(data.type).to.be.equal('remove');
  //       expect(data.success).to.be.equal(true);
  //       done();
  //     }
  //   });
  // }),
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

describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  // it('modifyFunction() method test 1', (done) => {
  //   const insertedMessage: RequestType = {type: 'modify', user: 'Samuel', title: 'newNote2', body: 'This is a new body'};
  //   optionFunctions.modifyFunction(insertedMessage, socket, (_, data) => {
  //     if (data) {
  //       expect(data.type).to.be.equal('modify');
  //       expect(data.success).to.be.equal(true);
  //       done();
  //     }
  //   });
  // }),
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

describe('ServerFunction class tests', () => {
  const socket = new net.Socket();
  // it('addUserFunction() method test 1', (done) => {
  //   const insertedMessage: RequestType = {type: 'addUser', user: 'Pepe'};
  //   optionFunctions.addUserFunction(insertedMessage, socket, (_, data) => {
  //     if (data) {
  //       expect(data.type).to.be.equal('addUser');
  //       expect(data.success).to.be.equal(true);
  //       done();
  //     }
  //   });
  // }),
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

// describe('ServerFunction class tests', () => {
//   const socket = new net.Socket();
//   it('userListFunction() method test 1', (done) => {
//     const insertedMessage: RequestType = {type: 'userList'};
//     optionFunctions.userListFunction(insertedMessage, socket, (_, data) => {
//       if (data) {
//         expect(data.type).to.be.equal('userList');
//         expect(data.success).to.be.equal(true);
//         done();
//       }
//     });
//   });
// });
