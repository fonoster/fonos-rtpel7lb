const Client = require('rtpengine-client').Client ;
const client = new Client() ;


// client.ping(22223, '192.168.1.239')
// client.ping(22222, '127.0.0.1')
//   .then((res) => {
//     console.log(`received ${JSON.stringify(res)}`); // {result: 'pong'}
//   })
//   .catch((err) => {
//     console.log(`Error: ${err}`);
// });


let sdp = 'v=0\r\no=FreeSWITCH 1607512482 1607512484 IN IP4 192.168.1.92\r\ns=FreeSWITCH\r\nc=IN IP4 192.168.1.92\r\nt=0 0\r\nm=audio 19240 RTP/AVP 18 101\r\na=rtpmap:18 G729/8000\r\na=fmtp:18 annexb=no\r\na=rtpmap:101 telephone-event/8000\r\na=fmtp:101 0-16\r\na=ptime:20\r\na=sendrecv\r\n'


let message = {
  'sdp': sdp,
  'call-id': 'dkjsljldshdhlshd12',
  'from-tag': 'djlkjdljd12'
}

client.offer(22222, '127.0.0.1', message)
// client.offer(22223, '192.168.1.239', message)
  .then((res) => {
    console.log(`received ${JSON.stringify(res)}`); // {result: 'pong'}



    message = {
      'sdp': sdp,
      'call-id': 'dkjsljldshdhlshd13',
      'from-tag': 'djlkjdljd13'
    }

    console.log('=================================');

    client.offer(22222, '127.0.0.1', message)
    // client.offer(22223, '192.168.1.239', message)
      .then((res) => {
        console.log(`received ${JSON.stringify(res)}`); // {result: 'pong'}
        client.close();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
    });



  })
  .catch((err) => {
    console.log(`Error: ${err}`);
});


