#!/usr/bin/env node
// Running the load balancer
const RTPL = require('./src/server').default
new RTPL().start()
