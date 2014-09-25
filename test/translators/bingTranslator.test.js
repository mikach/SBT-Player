var expect = require('chai').expect;
var translator = require('../../app/js/translators/bingTranslator.js');

describe('Translator', function() {

    it('translator.translate should be instance of Promise', function() {
        expect(translator.translate).to.be.instanceOf(Function);
        expect(translator.translate({text: 'stuff', from: 'en', to: 'ru'}).then).to.be.instanceOf(Function);
    });

    it('translator.translate works correctly with languages passed as arguments', function(done) {
        this.timeout(3000);
        translator.translate({text: 'hello', from: 'en', to: 'fr'}).then(function(translate) {
            expect(translate).to.be.equal('Salut');
            done();
        });
    });

    /**
     * Pretty useless test, we test whether bingTokeProm.get() returns the same values
     */
    it('translator.translate uses the same token promise before timeout reached', function(done) {
        this.timeout(3000);
        var access_token1, access_token2;
        translator._getTokenProm()
            .then(function(data) {
                access_token1 = JSON.parse(data).access_token;
                expect(access_token1).not.to.be.undefined;
                translator._getTokenProm()
                    .then(function(data) {
                        access_token2 = JSON.parse(data).access_token;
                        expect(access_token2).not.to.be.undefined;
                        expect(access_token1).to.be.equal(access_token2);
                        done();
                    });
            });
    });

    it('translator.translate renew token after timeout', function(done) {
        this.timeout(6000);
        var renewalPeriod = 2000;
        var promise1 = translator._getTokenProm();
        translator._mockRenewalPeriod(renewalPeriod);
        setTimeout(function() {
            var promise2 = translator._getTokenProm();
            expect(promise1).not.to.be.equal(promise2);
            done();
        }, renewalPeriod);
    })
});
