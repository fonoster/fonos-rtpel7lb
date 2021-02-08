import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ChaiAsPromised from 'chai-as-promised'
import Redis from 'ioredis'
const redis = new Redis();
const sandbox = sinon.createSandbox()
const expect = chai.expect
chai.use(sinonChai)
chai.use(ChaiAsPromised)

describe('Redis', () => {

  let findStub;
  let sampleCall: string;

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
      let stub = sandbox.stub(redis, 'get').yields(null, {rtp_id: 'bar'});

      redis.get('foo', (err, result) => {
        expect(err).to.not.exist
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWith('foo');
        expect(result).to.be.a('object')
        expect(result).to.have.property('rtp_id').to.equal('bar')

        done();
      })
    })

  })

  context('Set', () => {

    it('should create an instance', () => {

      redis.set('foo', 'bar', (err, result) => {
        expect(err).to.not.exist
        expect(result).to.exist
        expect(result).to.be.a('string')
      })

    })

  })
  
})