import { Client, RtpEngineError } from 'rtpengine-client'
import * as udp from 'dgram'

class Server {

    constructor(port, ipaddr) {
        this.port = port || 22222;
        this.ipaddr = ipaddr || "0.0.0.0";

        this.messages = new Map();
    }

    start() {
        this.socket = udp.createSocket('udp4');
        this.socket.bind(this.port, this.ipaddr);

         //emits after the socket is closed using socket.close();
         this.socket.on('close', function () {
            console.log('Socket is closed !');
        });

        let ipaddr = this.ipaddr;
        let port = this.port;

        this.socket.on('message', this._onMessage.bind(this)) ;
        this.socket.on('error', this._onError.bind(this)) ;

        this.socket.on('listening', function () {
            console.log(`Server listening on ${ipaddr}:${port}`);
        });
    }

    setStoreProvider(store){
        this.store = store;
    }

    _onMessage(msg, info) {
        const obj = Client.decodeMessage(msg);

        if (!obj) {
            this._onError(new RtpEngineError(`malformed/unexpected message format ${msg}`));
            return ;
          }

          // TODO: select one of the RTPEngine servers
          console.log('decode: ', obj);

          console.log('Data received from client : ' + msg.toString());
          console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);

          if (obj.data.command == "ping"){
                let message = Client.encodeMessage(obj.id, {result:"pong"});
                console.log(` sending ${obj.id} : `, message.toString())
                //sending msg
                this.socket.send(message, info.port, info.address, function (error) {
                    if (error) {
                    // client.close();
                    } else {
                        console.log('Data sent !!!');
                    }
                });
          }
    }

    _onError(err){

        console.error(err);
    }



}

module.exports = Server;
