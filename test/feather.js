'use strict'
process.env.NODE_ENV = 'test'
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var expect = chai.expect
const exec = require('child_process').exec
const Feather = require('../scripts/feather.js')

describe('Feather Fetcher', function(){

  this.timeout(5000)

  before('Delete all used folders', function(done){
    exec('rm -R tmp/', err => {
      done()
    })
  })

  beforeEach('wait', function(done){
    setTimeout(done, 100)
  })

  it('can list packages', function(){
    this.timeout(15000)
    return Feather.listPackages()
      .then(function(packages){
        expect(packages).to.be.an('array')
        expect(packages[0].name).to.be.a('string')
        expect(packages[0].zipball_url).to.be.a('string')
      })
  })

  it('can get the SF version of the current install')

  it('can determine is one version is greater than another', function(){
    const valids = [
      {x: '1.2.3.5', y: '1.2.3.4'},
      {x: '3.2222.1', y: '2.9999.9999'},
      {x: '1.7.600.0', y: '1.6.500.0'},
      {x: 'latest', y: '99.99.99.99'}
    ]
    const invalids = [
      {x: '999.9999', y: 'latest'},
      {x: '1', y: '2'}
    ]

    for(var i in valids){
      const result = Feather.isVersionGreater(valids[i].x, valids[i].y)
      expect(result).to.equal(true)
    }
    for(var z in invalids){
      const result = Feather.isVersionGreater(invalids[z].x, invalids[z].y)
      expect(result).to.not.equal(true)
    }
  })

  it('can correctly parse the compatability table', function(){
    const tableTxt = `|----|----|
| v.1.7.600.0 - latest | 9.2.6200.0 to 9.2.9999 |
| v.1.6.500.0 - 1.6.560.0 | 9.1.6100.0 to 9.1.9999 |
| v.1.5.470.0 - 1.5.490.0 | 9.0.6000.0 to 9.0.9999 |
| v.1.4.360.0 - 1.4.460.0 | 8.2.5900.0 to 8.2.9999 |
| v.1.3.300.1 - 1.3.350.0 | 8.1.5800.0 to 8.1.9999 |
| v.1.2.120.0 - 1.2.290.1 | 8.0.5700.0 to 8.0.9999 |
| v.1.1.20.3 - 1.1.110.0 | 7.3.5600.0 to 7.3.9999 |
| v.1.0.0.0 - 1.0.10.2 | 7.2.5300.0 to 7.2.9999 |
| v.0.5.1000.4  | 7.1.5208.0 to 7.1.9999 |
| v.0.4.1000.2  | 7.1.5200.0 to 7.1.9999 |
| v0.1.1000.1 - v.0.3.1000.4  | 7.0.5100.0 to 7.0.9999 |
# License`.trim()
    const table = Feather.parseTable(tableTxt)
    expect(table).to.be.an('array')
    expect(table.length).to.equal(11)
    expect(table[0]).to.be.an('object')
    expect(table[0].feather_from).to.equal('1.7.600.0')
    expect(table[0].feather_to).to.equal('latest')
    expect(table[0].sf_from).to.equal('9.2.6200.0')
    expect(table[0].sf_to).to.equal('9.2.9999')
    expect(table[10].feather_from).to.equal('0.1.1000.1')
    expect(table[10].feather_to).to.equal('0.3.1000.4')
  })

  it('can get and parse the compatability table', function(){
    this.timeout(15000)
    return Feather.getCompatibility()
      .then(function(table){
        expect(table).to.be.an('array')
        expect(table[0]).to.be.an('object')
        expect(table[0]).to.have.all.keys(['sf_from', 'sf_to', 'feather_from', 'feather_to'])
      })
  })

  it('can properly check if a feather version is usable', function(){
    const table = [
      {feather_from: '1.7.600.0', feather_to: 'latest', sf_from: '9.2.6200.0', sf_to: '9.2.9999'},
      {feather_from: '1.6.500.0', feather_to: 'latest', sf_from: '9.1.6100.0', sf_to: '9.1.9999'}
    ]
    expect(Feather.isRowUsable('9.2.7000.0', table[0])).to.equal(true)
    expect(Feather.isRowUsable('9.2.7000.0', table[1])).to.equal(false)
    expect(Feather.isRowUsable('9.1.7000.0', table[0])).to.equal(false)
    expect(Feather.isRowUsable('9.1.7000.0', table[1])).to.equal(true)
  })

  it('can find the latest version you can use', function(){
    const table = [
      {feather_from: '1.7.600.0', feather_to: 'latest', sf_from: '9.2.6200.0', sf_to: '9.2.9999'},
      {feather_from: '1.6.500.0', feather_to: 'latest', sf_from: '9.1.6100.0', sf_to: '9.1.9999'}
    ]
    const first = Feather.getValidVersion('9.2.7200', table)
    const second = Feather.getValidVersion('9.1.6200', table)
    const none = Feather.getValidVersion('10.1000', table)

    expect(first).to.be.an('object')
    expect(first.sf_from).to.equal('9.2.6200.0')
    expect(second).to.be.an('object')
    expect(second.sf_from).to.equal('9.1.6100.0')
    expect(none).to.equal(false)
  })

  it('can grab the latest package', function(){
    this.timeout(15000)
    return Feather.getLatest()
      .then(function(x){
        expect(x).to.be.a('array')
        expect(x).to.have.length(4)
      })
  })

  it('can install Feather', function(){
    this.retries(3);
    return Feather.install(Feather.Packages[0])
      .then(function(res){
        expect(res).to.be.a('string')
      })
  })
  it('can gather Foundation', function(){
    this.retries(3);
    return Feather.install(Feather.Packages[1])
      .then(function(res){
        expect(res).to.be.a('string')
      })
  })
  it('can gather SemanticUI', function(){
    this.retries(3);
    return Feather.install(Feather.Packages[2])
      .then(function(res){
        expect(res).to.be.a('string')
      })
  })

  it('can gather Minimal', function(){
    this.retries(3);
    return Feather.install(Feather.Packages[3])
      .then(function(res){
        expect(res).to.be.a('string')
      })
  })

  it('can clean up after itself', function(){
    return Feather.cleanup()
      .then(function(res){
        expect(res).to.be.true
      })
  })

})
