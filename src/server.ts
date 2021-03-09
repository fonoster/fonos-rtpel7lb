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
		let command: string = String(callInfo.data.command)
		let call: string = await this.redisManager.get(callInfo.data['call-id'])
		let rtpeInstance

		console.log(call);
		if(call){
			console.log('llamada existio');
			rtpeInstance = await this.redisManager.get(callInfo.data['call-id']);
			for(let i = 0; i < this.rtpList.length; i++){
				if(this.rtpList[i].ID == rtpeInstance){
					rtpeInstance = this.rtpList[i]
				}
			}
			console.log(rtpeInstance);
		} else {
			rtpeInstance = this.getNextRtpl();
			console.log('llamada new:', callInfo.id);
			console.log('Rtpe de turno:', rtpeInstance);
			await this.redisManager.create(callInfo.data['call-id'], rtpeInstance.ID)
		}

		const sdp = String(callInfo.data.sdp)
		const callid = callInfo.data['call-id']
		const fromtag = callInfo.data['from-tag']

		switch (command){
			case 'ping': this.socket.reply(info, callInfo.id, 'pong')
				break
			case 'offer':
				// let client = new Client({port: info.port, host: info.address})
				// client.offer(22223, info.address, {
				// 	sdp,
				// 	'call-id': callid,
				// 	'from-tag': fromtag
				// }).then((res: any) => {
				// 	console.log(res);
				// }).catch((err: any) => {
				// 	console.log(err);
				// });

				// await rtpeInstance.offer(client)
				break
			default:
				throw new Error('Unknown command')
		}
  }    

}
