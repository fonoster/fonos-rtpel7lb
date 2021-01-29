#!/usr/bin/env node
// Running the load balancer
const Server = require('./dist/src/server').default
new Server().start()
