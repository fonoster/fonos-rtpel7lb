import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import ChaiAsPromised from 'chai-as-promised'
import Consul from 'consul'
import { listServices } from '../../../src/consul/consul';


const sandbox = sinon.createSandbox()
const expect = chai.expect
chai.use(sinonChai)
chai.use(ChaiAsPromised)

describe('Consul', () => {

  let findStub;
  let sampleCall: object;
  let consulMock = new Consul()

  beforeEach(() => {
    sampleCall = {}
    
    findStub = sandbox.stub(Consul.Agent, 'Service').resolves(sampleCall)
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('list', () => {

    it('should get a call and return the result', (done) => {
      sandbox.restore();
      let stub = sandbox.stub(consulMock.agent.service, 'list').resolves(sampleCall)
      
      let res = consulMock.agent.service.list(listServices)
      expect(stub).to.have.been.calledOnce
      expect(stub).to.have.been.calledWith(listServices)
      expect(res).to.exist
      done();

    })
  })
})
