import { Sockets } from './sockets/socket';
import { RedisManager } from './redis/redisconnection';
import Consul from 'consul'
import { listServices } from './consul/consul';

export default class RTPL {
    constructor(
        private _Sockets: Sockets,
        private _RedisManager: RedisManager,
        private _Consul = new Consul()
    ){}

    start() {
        console.log('Hello world')
    }

    updateRtpList() {
      this._Consul.agent.service.list(listServices)
    }

    processRequest(callInfo: any) {
        let obj = this._Sockets.onMessage(callInfo.msg, callInfo);
        let call: string = this._RedisManager.get(obj.id)

        if(!call){
            console.log('Es nueva');
        } else {
            console.log('Usar valor en Redis');
        }

    }
    
}
