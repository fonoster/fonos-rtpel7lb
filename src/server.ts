import Consul from 'consul'
import { Sockets } from './sockets/socket';
import { RedisManager } from './redis/redis_conn'
const Client = require('rtpengine-client').Client

export default class RTPL {
	private rtpList: object[] = []
	private index: number = 0;
	socket: Sockets;
	private consul
	private redisManager

    constructor(redisManager: RedisManager, consul = new Consul()) {
		// setInterval(this._Consul.agent.service.list(this.updateRtpList), 500)
		this.consul = consul
		this.redisManager = redisManager
	}	

    start() {
      	this.socket = new Sockets(this)
	  	this.consul.agent.service.list((err, result) => this.updateRtpList(err, result))
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

    async processRequest(callInfo: any) {
		console.log('XXXXXXXXX callInfo: ', callInfo);
		let call: string = await this.redisManager.get(callInfo.id)
		let rtpeInstance

		if(call){
			console.log('DBG005');
			rtpeInstance = await this.redisManager.get(call);
		} else {
			console.log('DBG004 call', call);
			rtpeInstance = this.getNextRtpl();
			await this.redisManager.create(callInfo.id, "changeit me")
		}
	
		console.log('callInfo.data.command', callInfo.data.command);

		switch (callInfo.data.command){
			case 'ping': this.socket.reply(callInfo, 'pong')
				break
			case 'offer':
				// await rtpeInstance.offer()
			default:
				throw new Error('Unknown command')
		}
  	}    
}
