const Client = require('rtpengine-client').Client
const client = new Client()
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const DUT_HOST = process.env.DUT_HOST || 'localhost'
const DUT_PORT = parseInt(process.env.DUT_PORT) || 22222

describe('RTPEL7LB EET', () => {

  // If the DUT is not up this will simply timeout and the error will not be catched
  it('Sends ping command to device under test', done => {
      client.ping(DUT_PORT, DUT_HOST).then(res => {
        if(res.result !== 'pong') {
          done(`Expected result to be {"result": "pong"}`)
        } 
        done()
      }).catch(e => {
        done(e)
      }).finally(() => {
        client.close()
      })
  })
})
