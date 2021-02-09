import { Sockets } from './sockets/socket';
import { RedisManager } from './redis/redisconnection';


export default class RTPL {
    constructor(
        private _Sockets: Sockets,
        private _RedisManager: RedisManager
    ){}

    start() {
        console.log('Hello world')
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
