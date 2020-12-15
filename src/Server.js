import BencodeUtils from './utils/BencodeUtils'
import BackendServer from './BackendServer'
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

        this.socket.on('message', this.onMessage.bind(this)) ;
        this.socket.on('error', this.onError.bind(this)) ;

        this.socket.on('listening', function () {
            console.log(`Server listening on ${ipaddr}:${port}`);
        });

        // TODO: load static defined RTPEngine servers
        this.backendServerManager = new BackendServer();
    }

    setStoreProvider(store){
        this.store = store;
    }

    onMessage(msg, info) {
        let obj = BencodeUtils.decodeMessage(msg);

        console.log('Data received from client : ' + msg.toString());

        if (!obj) {
            this._onError(new RtpEngineError(`malformed/unexpected message format ${msg}`));
            return;
        }

        console.log(`Received command '${obj.data.command}' from ${info.address}:${info.port}`);
        console.log(`Received command : `+JSON.stringify(obj));

        switch (obj.data.command){
            case "ping":
                this.checkAvailableRtpServers(info, obj);
                break;
            case "offer":
                this.offer(info, obj, msg);
                break;
            default:
                console.log(`Received command : ${JSON.stringify(obj)}`);

                let mes = {
                    "result": "error",
                    "error-reason": `Method "${obj.data.command}" not implemented yet`
                };

                let message = BencodeUtils.encodeMessage(obj.id, mes);
                this.reply(info, message);
        }
    }

    onError(err){
        console.error(err);
    }

    reply(info, message){
        this.socket.send(message, info.port, info.address, function (error) {
            if (error) {
                console.log(`error sending reply to client.`);
            }
        });
    }

    checkAvailableRtpServers(info, obj) {
         // TODO: create a cron process that handle backend servers status.
         if (this.backendServerManager.checkAvailableRtpServers()) {
            console.log(`Replying to 'ping' from ${info.address}:${info.port} (elapsed time 0.000000 sec)`);
            let message = BencodeUtils.encodeMessage(obj.id, { result: "pong" });
            this.reply(info, message);
        }
    }

    offer(info, obj, msg) {
        this.backendServerManager.send(obj.id, msg)
            .then(res => {
                console.log('res => ', res.message.toString());
                this.reply(info, res.message);
            })
            .catch( err => console.log(err));
    }
}

module.exports = Server;
