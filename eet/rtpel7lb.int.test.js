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
      client.ping(DUT_PORT, DUT_HOST)
        .then(res => {
          if(res.result !== 'pong') {
            done(`Expected result to be {"result": "pong"}`);
          } else {
            done();
          }
        }).catch(e => {
          done(e);
        }).finally(() => {
          // client.close()
        })
  })

  // SDP
  let sdp = `v=0
o=Routr 1607512482 1607512484 IN IP4 192.168.1.92
s=Routr
c=IN IP4 192.168.1.92
t=0 0
m=audio 19240 RTP/AVP 18 101
a=rtpmap:18 G729/8000
a=fmtp:18 annexb=no
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-16
a=ptime:20
a=sendrecv
`

  let message = {
    'sdp': sdp,
    'call-id': 'fake-caller-id',
    'from-tag': 'fake-from-tag',
    'to-tag': 'fake-to-tag'
  }

  // If the DUT is not up this will simply timeout and the error will not be catched
  it('Sends offer command to device under test', done => {

    client.offer(DUT_PORT, DUT_HOST, message)
      .then((res) => {
        // console.log(`received ${JSON.stringify(res)}`);
        if(res.result !== 'ok') {
          done(`Expected result to be {"result": "pong"}`);
        } else {
          done();
        }
      }).catch(e => {
        done(e);
      }).finally(() => {
        // client.close()
      })
  })


    // If the DUT is not up this will simply timeout and the error will not be catched
    it('Sends answer command to device under test', done => {

      client.answer(DUT_PORT, DUT_HOST, message)
        .then((res) => {
          // console.log(`received ${JSON.stringify(res)}`);
          if(res.result !== 'ok') {
            done(`Expected result to be {"result": "pong"}`);
          } else {
            done();
          }
        }).catch(e => {
          done(e);
        }).finally(() => {
          // client.close()
        })
    })


    // If the DUT is not up this will simply timeout and the error will not be catched
    it('Sends delete command to device under test', done => {

      client.delete(DUT_PORT, DUT_HOST, message)
        .then((res) => {
          // console.log(`received ${JSON.stringify(res)}`);
          if(res.result !== 'ok') {
            done(`Expected result to be {"result": "pong"}`);
          } else {
            done();
          }
        }).catch(e => {
          done(e);
        }).finally(() => {
          client.close()
        })
    })

})
