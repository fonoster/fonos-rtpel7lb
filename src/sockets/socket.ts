import dgram from 'dgram'
import { BencodeUtils } from '../utils/bencode_util'
// export const socket = dgram.createSocket('udp4')

export class Sockets {
  socket: dgram.Socket;
  server: any
  constructor(
    server: any 
  ){
    this.socket = dgram.createSocket('udp4')
    this.socket.bind(8081)
    this.socket.on('message', (value) => console.log(value))
    this.server = server
  }

  onMessage(msg: any, info: any) {
    let obj = BencodeUtils.decodeMessage(msg);

    console.log('Data received from client : ' + msg.toString());

    if (!obj)
      throw new Error(`malformed/unexpected message format ${msg}`)

    console.log(`Received command '${obj.data.command}' from ${info.address}:${info.port}`);
    console.log(`Received command : `+JSON.stringify(obj));

    this.server.processRequest(obj);
  }

  
  reply(info: any, message: any){
    this.socket.send(message, info.port, info.address, function (error) {
        if (error) {
            console.log(`Error sending reply to client (${info.address}:${info.port}).`);
        }
    });
  }

}



// const _socket = new Sockets();
// socket.on('message', _socket.onMessage.bind(this))
// socket.bind(8081)

