import Consul from 'consul'
import { Sockets } from './sockets/socket';
import { RedisManager } from './redis/redis_conn'
const Client = require('rtpengine-client').Client

export default class RTPL {
	private rtpList: any[] = []
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
	try {
		const command: string = String(callInfo.data.command)
		const callId: string = callInfo.data['call-id']
		let call: string = await this.redisManager.get(callId)
		let rtpeInstance

		if(call){
			rtpeInstance = await this.redisManager.get(callId);
			for(let i = 0; i < this.rtpList.length; i++){
				if(this.rtpList[i].ID == rtpeInstance){
					rtpeInstance = this.rtpList[i]
				}
			}
			console.log(rtpeInstance);
		} else {
			rtpeInstance = this.getNextRtpl();
			await this.redisManager.create(callId, rtpeInstance.ID)
		}

		const client = new Client({port: info.port, host: info.address})
		let response

		if (command === 'ping') {
			response =  { result: 'pong' }
		} else {
			response = await client[command](rtpeInstance.Port, info.address, callInfo.data)
		}

		response['call-id'] = callId
		response['rtpe-id'] = rtpeInstance.ID

		this.socket.reply(info, callInfo.id, response)
  	} catch(error:any) {
		console.log(error)
	}	
  }    

}
