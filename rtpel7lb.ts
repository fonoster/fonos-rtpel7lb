#!/usr/bin/env node
// Running the load balancer
import { RedisManager } from './src/redis/redis_conn';
import Redis from 'ioredis';
const redis = new RedisManager(new Redis());
const Server = require('./src/server').default
const server = new Server(redis)
server.start()
