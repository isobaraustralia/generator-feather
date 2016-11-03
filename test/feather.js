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
    setTimeout(done, 1000)
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
