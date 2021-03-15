import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Consul from 'consul'
import fromCallback from './helper'
import { nanoid } from 'nanoid'
const RTPEngine = require('rtpengine-client').Client
const sandbox = sinon.createSandbox()
const expect = chai.expect
chai.use(sinonChai)

const sdp =`v=0
o=mhandley 2890844526 2890842807 IN IP4 126.16.64.4
s=SDP Seminar
i=A Seminar on the session description protocol
u=http://www.cs.ucl.ac.uk/staff/M.Handley/sdp.03.ps
e=mjh@isi.edu(Mark Handley)
c=IN IP4 224.2.17.12
t=2873397496 2873404696
a=recvonly
m=audio 49170 RTP/AVP 0
m=video 51372 RTP/AVP 31
m=application 32416udp wb
a=orient:portrait`

describe('Integration test for RTPEL7LB, Redis, and Consul', () => {
    const loadBalancePort = 22224
    let loadBalancer: any

    before(async() => {
        const consul = new Consul({ promisify: fromCallback })
        const rtpengineN1 = {
            name: 'rtpengine_n1',
            ID: 'n1',
            tags: ['testing'],
            port: 22222
        }
        const rtpengineN2 = {
            name: 'rtpengine_n2',
            ID: 'n2',
            tags: ['testing'],
            port: 22223
        }

        await consul.agent.service.register(rtpengineN1)
        await consul.agent.service.register(rtpengineN2)

        loadBalancer = new RTPEngine()
    })

    it('sends a ping request to the RTPEL7LB', async() => {
        const response = await loadBalancer.ping(loadBalancePort, 'localhost')
        expect(response.result).to.be.equal('pong')
    })

    it('sends an offer and answer', async() => {
        const callId = nanoid(5)
        const fromTag = nanoid(5)
        const toTag = nanoid(5)

        const r1 = await loadBalancer.offer(loadBalancePort, 'localhost', {
            'call-id': callId,
            'from-tag': fromTag,
            sdp
        })

        const r2 = await loadBalancer.answer(loadBalancePort, 'localhost', {
            'call-id': callId,
            'from-tag': fromTag,
            'to-tag': toTag,
            sdp
        })

        expect(r1['call-id']).to.be.equal(callId)
        expect(r2['call-id']).to.be.equal(callId)
        expect(r1['rtpe-id']).to.be.equal(r2['rtpe-id'])
    })
})