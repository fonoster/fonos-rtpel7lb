import * as udp from 'dgram'
import WRRPool from 'wrr-pool'

class BackendServer {

    constructor(){
        this.socket = udp.createSocket('udp4');
        this.socket.on('message', this.onMessage.bind(this)) ;
        this.socket.on('error', this.onError.bind(this)) ;

        this.messages = new Map();

        // TODO: create interface/API to register rtpengine server automatically
        this.rtpEngines = [
            {
                id: 'rtpengine_n1',
                hostAddress: '192.168.1.239',
                hostPort: 22223,
                weight: 2,
            },
            {
                id: 'rtpengine_n2',
                hostAddress: '192.168.1.239',
                hostPort: 22224,
                weight: 4,
            }
        ];

        this.pool = new WRRPool();
        this.rtpEngines.forEach( v => this.pool.add(v, v.weight) );

        this.rtpEnginesAvailable = 2;
    }

    send(cookie, message, serverId) {
        return new Promise((resolve, reject) => {

            // TODO: Manage timeouts.
            // TODO: Manage errors and try others backend servers if exists.
            // TODO: Handle when not RTPEngine is found.
            let rtpEngine = null;
            if (serverId != null){
                let data = this.pool.get({ id: serverId });
                if (data != null){
                    rtpEngine = data.value;
                }
            } else {
                rtpEngine = this.pool.next();
            }

            let handlerAndData = { resolve, reject, usedRtpEngine: rtpEngine };
            this.messages.set(cookie, handlerAndData);

            console.log(`Sending command to rtpengine "${rtpEngine.id}" at ${rtpEngine.hostAddress}:${rtpEngine.hostPort}`) ;

            this.socket.send(message, rtpEngine.hostPort, rtpEngine.hostAddress, (err) => {
                if (err) {
                    console.log(`Error sending command to rtpengine "${rtpEngine.id}" at ${rtpEngine.hostAddress}:${rtpEngine.hostPort}`) ;
                    this.messages.delete(cookie) ;
                    return reject(err);
                }
            });
        });

    }

    checkAvailableRtpServers() {
        // TODO: create a cron process that handle backend servers status check.
        return this.rtpEnginesAvailable > 0
    }

    onMessage(msg) {
        const m = msg.toString();
        const idx = m.indexOf(' ');
        const id = m.substring(0, idx);

        // TODO: handle this error
        if (!this.messages.has(id)) {
            return;
        }

        const handlerAndData = this.messages.get(id);
        this.messages.delete(id);

        console.log('Reply from RTPEngine => ', handlerAndData.usedRtpEngine);

        handlerAndData.resolve({ message: msg, server: handlerAndData.usedRtpEngine });
    }

    onError(err){
        console.error(err);
    }
}



module.exports = BackendServer;
