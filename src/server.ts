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

    processRequest(call_info: any) {
        let obj = this._Sockets.onMessage(call_info.msg, call_info);
        let call: string = this._RedisManager.getInstance(obj.id)

        if(!call){
            console.log('Es nueva');
        } else {
            console.log('Usar valor en Redis');
        }

    }
    
}
