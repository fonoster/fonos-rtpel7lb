import Server from './Server'
import { MemoryStore, RedisStore } from './store'

const NG_PORT = process.env.RTPEL7LB_NG_PORT || 22222
const USE_REDIS_STORE = ('YES' == process.env.RTPEL7LB_REDIS_ENABLED)

// TODO:
//  - Load API
//  - Load Storage Provider

let server = new Server(NG_PORT, "0.0.0.0");
let storeProvider = new MemoryStore();

if (USE_REDIS_STORE){
  REDIS_URL = process.env.RTPEL7LB_REDIS_URL;
  storeProvider = new RedisStore(REDIS_URL);
}

server.setStoreProvider(storeProvider)

// Start RTPEngine Proxy
server.start();
