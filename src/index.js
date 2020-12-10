import Server from './Server'
import { MemoryStore, RedisStore } from './store'

const NG_PORT = process.env.RTPEL7LB_NG_PORT || 22222
const USE_REDIS_STORE = 'YES' == process.env.RTPEL7LB_STORE_REDIS

// TODO:
//  - Load API
//  - Load Storage Provider

let server = new Server(NG_PORT, "0.0.0.0");
let storeProvider = new MemoryStore();

if (USE_REDIS_STORE){
  storeProvider = new RedisStore();
}

server.setStoreProvider(storeProvider)

// Start RTPEngine Proxy
server.start();
