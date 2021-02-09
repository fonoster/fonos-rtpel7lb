import dgram from 'dgram'
import { BencodeUtils } from '../utils/bencode_util'
export const socket = dgram.createSocket('udp4')

export class Sockets {

  onMessage(msg: any, info: any) {
    let obj = BencodeUtils.decodeMessage(msg);

    console.log('Data received from client : ' + msg.toString());

    if (!obj)
      throw new Error(`malformed/unexpected message format ${msg}`)

    console.log(`Received command '${obj.data.command}' from ${info.address}:${info.port}`);
    console.log(`Received command : `+JSON.stringify(obj));

    return obj;
  }

}

const _socket = new Sockets();
socket.on('message', _socket.onMessage.bind(this))

