import { Redis } from 'ioredis'

export class RedisManager {

  private redis: Redis
  
  constructor (redis: Redis) {
    this.redis = redis;
  }

  async create(callId: string, rtpeId: string) {
    return await this.redis.set(callId, rtpeId);
  }

  get(callId: string): string {
    const res: any = this.redis.get(callId, (err: any, result: any) => {
      if (err)
        return err
    
      return result
    })

    return res;
  }
}
