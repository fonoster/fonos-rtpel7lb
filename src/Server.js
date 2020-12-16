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

        this.socket.on('close', () => console.log('Socket is closed !'));
        this.socket.on('message', this.onMessage.bind(this)) ;
        this.socket.on('error', this.onError.bind(this)) ;
        this.socket.on('listening', () => console.log(`Server listening on ${this.ipaddr}:${this.port}`));

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
            case "answer":
                this.answer(info, obj, msg);
                break;
            case "delete":
                this.delete(info, obj, msg);
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
                console.log(`Error sending reply to client (${info.address}:${info.port}).`);
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

    getKey(msg) {
        let callId = obj.data['call-id'];
        let fromTag = obj.data['from-tag'];
        return `${callId}:${fromTag}`;
    }

    offer(info, obj, msg) {

        let key = this.getKey(msg);

        this.backendServerManager.send(obj.id, msg)
            .then(res => {
                this.store.set(key, res.server.id);
                console.log(`Offer received from server '${res.server.id}'`);
                this.reply(info, res.message);
            })
            .catch( err => console.log(err));
    }

    delete(info, obj, msg) {

        let key = this.getKey(msg);
        let serverId = this.store.get(key);

        console.log(`Sending 'delete' to server '${serverId}'`);

        this.backendServerManager.send(obj.id, msg, serverId)
            .then(res => {
                this.store.del(key);
                this.reply(info, res.message);
            })
            .catch( err => console.log(err));
    }

    answer(info, obj, msg) {

        let key = this.getKey(msg);
        let serverId = this.store.get(key);

        console.log(`Sending 'answer' to server '${serverId}'`);

        this.backendServerManager.send(obj.id, msg, serverId)
            .then(res => {
                this.reply(info, res.message);
            })
            .catch( err => console.log(err));
    }
}

module.exports = Server;
