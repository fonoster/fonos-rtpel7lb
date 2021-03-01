#!/usr/bin/env node
// Running the load balancer
import { RedisManager } from './src/redis/redisconnection';
import Redis from 'ioredis';
const redis = new RedisManager(new Redis());
const RTPL = require('./src/server').default
new RTPL(redis)

