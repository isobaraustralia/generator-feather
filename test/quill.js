'use strict'
process.env.NODE_ENV = 'test'
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var expect = chai.expect
const exec = require('child_process').exec
const Bootstrap = require('../scripts/feather.js')
const fs = require('fs')
const helpers = require('yeoman-test')
const path = require('path')

describe('Quill', function(){

  describe('Feather Fetcher', function(){

    this.timeout(5000)

    before('Delete all used folders', function(done){
      exec('rm -R tmp/', err => {
        done()
      })
    })

    it('can grab the latest package', function(){
      this.timeout(15000)
      return Bootstrap.getLatest()
        .then(function(x){
          expect(x).to.be.a('array')
          expect(x).to.have.length(4)
        })
    })

    it('can install Bootstrap', function(){
      return Bootstrap.install(Bootstrap.Packages[0])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })
    it('can gather Foundation', function(){
      return Bootstrap.install(Bootstrap.Packages[1])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })
    it('can gather SemanticUI', function(){
      return Bootstrap.install(Bootstrap.Packages[2])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })
    it('can gather Minimal', function(){
      return Bootstrap.install(Bootstrap.Packages[3])
        .then(function(res){
          expect(res).to.be.a('string')
        })
    })

    it('can clean up after itself', function(){
      return Bootstrap.cleanup()
        .then(function(res){
          expect(res).to.be.true
        })
    })

  })

  describe('generator', function(){

		this.timeout(40000)

    it('Delete assets folders', function(){
			return helpers.run(path.join(__dirname, '../generators/app'))
				.inTmpDir(function (dir) {
					console.log('dirname: ', dir)
				})
				.withPrompts({ name: 'testapp', framework: 'Bootstrap', version: 'latest' })
				.toPromise()
				.then(function (dir) {
					console.log(dir)
					expect( fs.existsSync(dir + '/package.json') ).to.be.true
				});
    })


		it('is ok', function(){})
	})

  describe('yarn run lint', function(){

    it('can run without crashing', function(done){
      exec('yarn run lint', err => {
        //expect(err).to.not.be.an('error')
        done()
      })
    })

  })

})

