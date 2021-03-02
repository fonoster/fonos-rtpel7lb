import Consul from 'consul'
import { Sockets } from './sockets/socket';
import { RedisManager } from './redis/redis_conn'

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
		
	}

	public getNextRtpl(){
		if(this.index == this.rtpList.length) this.index = 0
		return this.rtpList[this.index++]
	}

  async processRequest(callInfo: any, info: any) {
		let command: string = String(callInfo.data.command)
		let call: string = await this.redisManager.get(callInfo.id)
		let rtpeInstance

		if(call){
			rtpeInstance = this.redisManager.get(call);
		} else {
			rtpeInstance = this.getNextRtpl();
			console.log(callInfo.id);
			// await this.redisManager.create(callInfo.id, "changeit me")
		}
	
		console.log('callInfo.data.command', callInfo.data.command);

		switch (command){
			case 'ping': this.socket.reply(info, callInfo.id, 'pong')
				break
			case 'offer':
				// await rtpeInstance.offer()
			default:
				throw new Error('Unknown command')
		}
  }    
}
