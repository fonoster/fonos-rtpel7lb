import redis from 'redis'

class RedisStore {

    constructor(redisUrl){
        this.client = redis.createClient(redisUrl);
        this.defaultPrefix = 'fonos.rtpengine.'
    }

    set(id, value){
        this.client.set(this.defaultPrefix + id, JSON.stringify(value));
    }

    get(id){
        let key = this.defaultPrefix + id

        this.client.get(key, function(err, value){
            // TODO: create a method to call this method async/await
        });

        return null;
    }

    del(id) {

    }
}


module.exports = RedisStore;
