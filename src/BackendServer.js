import * as udp from 'dgram'

class BackendServer {

    constructor(){
        this.socket = udp.createSocket('udp4');
        this.socket.on('message', this.onMessage.bind(this)) ;
        this.socket.on('error', this.onError.bind(this)) ;

        this.messages = new Map();

        // TODO: create interface/API to register rtpengine server automatically
        this.rtpEngineServers = [
            {
                name: 'rtpengine_n1',
                address: '192.168.1.239',
                port: 22223,
                hits: 0,
            },
            {
                name: 'rtpengine_n2',
                address: '192.168.1.239',
                port: 22224,
                hits: 0,
            }
        ];

        this.rtpEngineServersAvailable = 2;
    }

    send(cookie, message) {
        return new Promise((resolve, reject) => {

            let handlerAndData = { resolve, reject }

            this.messages.set(cookie, handlerAndData);

            // TODO: Manage timeouts.
            // TODO: Manage errors and try others backend servers if exists.
            // TODO: create algorithm to select a backend rtpengine (round-robin, weigth, etc)
            let rtpEngine = this.rtpEngineServers[0];

            handlerAndData.server = rtpEngine;

            this.socket.send(message, rtpEngine.port, rtpEngine.address, (err) => {
                if (err) {
                  debug(`error sending command to rtpengine at ${this.remoteHost}:${this.remotePort}`) ;
                  this.messages.delete(cookie) ;
                  return reject(err);
                }
              });
        });

    }

    checkAvailableRtpServers() {
        // TODO: create a cron process that handle backend servers status check.
        return this.rtpEngineServersAvailable > 0
    }

    onMessage(msg) {
        const m = msg.toString();
        const idx = m.indexOf(' ');
        const id = m.substring(0, idx);

        // TODO: handle this error
        if (!this.messages.has(id)) {
            return ;
        }

        const p = this.messages.get(id);
        this.messages.delete(id);

        console.log('Reply by backend Server => ', p.server);

        p.resolve({ message: msg, server: p.server });
    }

    onError(err){
        console.error(err);
    }
}



module.exports = BackendServer;
