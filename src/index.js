import * as udp from 'dgram'

const NG_PORT = process.env.RTPEL7LB_NG_PORT || 22222

var server = udp.createSocket('udp4');

server.on('error', function (error) {
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message', function (msg, info) {

  console.log('Data received from client : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);

  //sending msg
  server.send(msg, info.port, info.address, function (error) {
    if (error) {
      client.close();
    } else {
      console.log('Data sent !!!');
    }
  });
});

server.on('listening', function () {
  let address = server.address();
  let port = address.port;
  let ipaddr = address.address;
  console.log('Server listening on '+ipaddr+':'+port);
});

//emits after the socket is closed using socket.close();
server.on('close', function () {
  console.log('Socket is closed !');
});

server.bind(NG_PORT);
