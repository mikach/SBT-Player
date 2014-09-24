var expect = require('chai').expect;
var Promise = require('bluebird').Promise;
var translator = require('../app/js/translator.js');

describe('Translator', function() {

    it('translator.translate should be instance of Promise', function() {
        expect(translator.translate).to.be.instanceOf(Function);
        expect(translator.translate({text: 'stuff'}).then).to.be.instanceOf(Function);
    });

    it('translator.translate works correctly with defaults', function(done) {
        this.timeout(3000);
        translator.translate({text: 'stuff'}).then(function(translate) {
            expect(translate).to.be.equal('вещи');
            done();
        });
    });

    it('translator.translate works correctly with languages passed as arguments', function(done) {
        this.timeout(3000);
        translator.translate({text: 'hello', from: 'en', to: 'fr'}).then(function(translate) {
            expect(translate).to.be.equal('Salut');
            done();
        });
    });

    it('translator.translate uses the same token promise before timeout reached', function(done) {
        this.timeout(3000);
        translator.translate({text: 'stuff'})
            .then(function(translate) {
                var token = translator._getBingTokenPromise()._getToken().access_token;
                expect(translator._getBingTokenPromise()._isInitialized()).to.be.true;
                translator.translate({text: 'stuff'}).then(function(translate) {
                    console.log("\nResult1: " + (token == translator._getBingTokenPromise()._getToken().access_token));
                    expect(translator._getBingTokenPromise()._getToken().access_token).to.be.equal(token);
                    done();
                });
        });
    });

    it('translator.translate renew token after timeout', function(done) {
        this.timeout(6000);
        var renewalPeriod = 2000;
        translator.translate({text: 'stuff'})
            .then(function(translate) {
                return translator._getBingTokenPromise()._getToken().access_token;
            })
            .then(function(token) {
                translator._getBingTokenPromise()._mockRenewalPeriod(renewalPeriod);
                setTimeout(function() {
                    translator.translate({text: 'stuff'}).then(function(translate) {
                        console.log("\nResult2: " + (token == translator._getBingTokenPromise()._getToken().access_token));
                        expect(translator._getBingTokenPromise()._getToken().access_token).not.to.be.equal(token);
                        done();
                    });
                }, renewalPeriod);
            });

    })
});