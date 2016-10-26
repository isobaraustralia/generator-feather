'use strict'
process.env.NODE_ENV = 'test'
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var expect = chai.expect
const exec = require('child_process').exec
const Bootstrap = require('../scripts/feather.js')
const fs = require('fs')

describe('Quill', function(){

  describe('yarn run bootstrap', function(){

    this.timeout(5000)

    before('Delete all used folders', function(done){
      exec('rm -R tmp/ Bootstrap/ Minimal/ Foundation/ SemanticUI/', err => {
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
          expect(res).to.be.true
        })
    })
    it('can gather Foundation', function(){
      return Bootstrap.install(Bootstrap.Packages[1])
        .then(function(res){
          expect(res).to.be.true
        })
    })
    it('can gather SemanticUI', function(){
      return Bootstrap.install(Bootstrap.Packages[2])
        .then(function(res){
          expect(res).to.be.true
        })
    })
    it('can gather Minimal', function(){
      return Bootstrap.install(Bootstrap.Packages[3])
        .then(function(res){
          expect(res).to.be.true
        })
    })

    it('can setup skeleton files', function(){
      expect( fs.existsSync('./src/sass/styles.sass') ).to.be.true
      expect( fs.existsSync('./src/js/app.js') ).to.be.true
    })

    it('can clean up after itself', function(){
      return Bootstrap.cleanup()
        .then(function(res){
          expect(res).to.be.true
        })
    })

  })

  describe('yarn run build', function(){

    before('Delete assets folders', function(done){
      exec('rm -R assets/', err => {
        done()
      })
    })

    it('has valid config', function(){
      const config = require('../../webpack.config.js')
      expect(config).to.be.an('object')
    })

    it('can run build', function(done){
      this.timeout(10000)
      exec('yarn run build', err => {
        expect(err).to.not.be.an('error')
        done()
      })
    })

    it('can produce a JS bundle', function(){
      expect( fs.existsSync('./assets/js/app.js') ).to.be.true
    })
    it('can produce JS sourcemaps', function(){
      expect( fs.existsSync('./assets/js/app.js.map') ).to.be.true
    })
    it('can produce a CSS bundle', function(){
      expect( fs.existsSync('./assets/css/styles.css') ).to.be.true
    })
    it('can produce CSS sourcemaps', function(){
      expect( fs.existsSync('./assets/css/styles.css.map') ).to.be.true
    })
    it('can optimize and produce source images', function(){
      expect( fs.existsSync('./assets/img/favicon.png') ).to.be.true
    })
    it('can proudce spritesheets', function(){
      expect( fs.existsSync('./assets/img/sprite.png') ).to.be.true
      expect( fs.existsSync('./assets/img/sprite@2x.png') ).to.be.true
    })
  })

  describe('yarn run dev', function(){
    it('can startup the dev server')
  })

  describe('yarn run lint', function(){

    it('can run without crashing', function(done){
      exec('yarn run lint', err => {
        //expect(err).to.not.be.an('error')
        done()
      })
    })

  })

  describe('Skeletons', function(){

    const ValidSkeleton = pkg => done => {
      const pkgPath = './tools/skeletons/' + pkg + '/'
      expect( fs.existsSync(pkgPath) ).to.be.true
      // Should not overwrite core files
      expect( fs.existsSync(pkgPath + 'sass/styles.sass') ).to.be.false
      expect( fs.existsSync(pkgPath + 'js/app.js') ).to.be.false
      done()
    }

    it('Bootstrap is valid', ValidSkeleton('Bootstrap'))
    it('Minimal is valid', ValidSkeleton('Minimal'))
    it('Foundation is valid', ValidSkeleton('Foundation'))
    it('SemanticUI is valid', ValidSkeleton('SemanticUI'))

  })

})

