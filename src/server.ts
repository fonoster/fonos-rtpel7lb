import { Sockets } from './sockets/socket';
import { RedisManager } from './redis/redisconnection'
const Client = require('rtpengine-client').Client
const client = new Client()
import Consul from 'consul'

export default class RTPL {
	private rtpList: object[] = []
	private index: number = 0;
	socket: Sockets;

    constructor(
        private _RedisManager: RedisManager,
        private _Consul = new Consul()
    )
		{
			// setInterval(this._Consul.agent.service.list(this.updateRtpList), 500)
			this._Consul.agent.service.list((err, result) => this.updateRtpList(err, result))
		}

    start() {
      this.socket = new Sockets(this);
    }

    updateRtpList(err: any, result: any) {
			if (err) throw err;
			result = Object.values(result)
			result.forEach((element: object) => {
				// const exist = this.rtpList.filter((e: object) => e === element)
				// if(exist) return
				this.rtpList.push(element)
			});
			
			// let uno = this.getNextRtpl()
			// console.log(uno);
			// for (let i = 0; i < result.length; i++) {
			// 	const element: object = result[i];
			// 	// this.rtpList.push(element)
			// 	// console.log(element);
			// }

			
			//rtpclient para conectarse al rtp
			
			// return console.log(result);

			//Si es new agregar a la lista
			//Si hay un valor que no viene y esta en la lista eliminar
			//
			//
    }

    public getNextRtpl(){
			if(this.index == this.rtpList.length) this.index = 0
			return this.rtpList[this.index++]
    }

    processRequest(callInfo: any) {
			console.log(callInfo);
      let call: string = this._RedisManager.get(callInfo.id)
			let rtpeInstance;

      if(!call){
        rtpeInstance = this.getNextRtpl();
				// this._RedisManager.create(call, rtpeInstance.id)
      } else {
				rtpeInstance = this._RedisManager.get(call);
			}
			switch (callInfo.data.command){
				case "ping": this.socket.reply(callInfo, 'pong')
					break
				case "offer":
					break
			}

			// Client(call, rtpeInstance);
			console.log(rtpeInstance);
  	}    
}
