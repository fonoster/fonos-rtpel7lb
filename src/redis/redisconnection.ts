import Redis from 'ioredis'
const redis = new Redis();

export class RedisManager {

  public async createInstance(call_ID: string, rtpe_ID: string) {
      
    let result = await redis.set(call_ID, rtpe_ID)

    if(!result)
      return 'Invalid Arguments'

    return result;
  }

  public getInstance(call_ID: string): string {
    const res: any = redis.get(call_ID, (err, result) => {
      if (err)
        return err;
    
      return result;
    });

    return res;
  }
  
}


// const redisM = new RedisManager();
// redisM.createInstance("foo", "bar");


// async function clg() {
//   const res = await redisM.getInstance("foo")
//   console.log(res);
// }

// clg();