import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ChaiAsPromised from 'chai-as-promised'
import Redis from 'ioredis'
import { RedisManager } from '../../../src/redis/redisconnection';
const sandbox = sinon.createSandbox()
const expect = chai.expect
chai.use(sinonChai)
chai.use(ChaiAsPromised)

describe('Redis', () => {

  let findStub;
  let sampleCall: string;
  let redisMock = new Redis();
  const redis = new RedisManager(redisMock);

  beforeEach(() => {
    sampleCall = 'bar'
    
    findStub = sandbox.stub(redis, 'get').resolves(sampleCall)
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('Get', () => {

    it('should get a call and return the result', (done) => {
      sandbox.restore();
      let stub = sandbox.stub(redisMock, 'get').yields(null, {rtp_id: 'bar'});
      
      let res = redis.get('foo')
      expect(stub).to.have.been.calledOnce
      expect(stub).to.have.been.calledWith('foo')
      expect(res).to.be.a('object')
      expect(res).to.have.property('rtp_id').to.equal('bar')
      done();

    })

    it('should trhow an err', (done) => {
      sandbox.restore();
      let stub = sandbox.stub(redisMock, 'get').throws(new Error);
      try{
        let res = redis.get('foo')
      }catch(err){
        expect(err).to.exist;
      }
      done();
    })

  })

  context('Set', () => {

    it('should create an instance', () => {
      sandbox.restore();
      let stub = sandbox.stub(redisMock, 'set').yields('foo', 'bar');

      redis.create('foo', 'bar')
      .then(result => {
        expect(result).to.exist
      })      
    })

  })
  
})