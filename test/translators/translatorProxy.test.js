var expect = require('chai').expect;
var _ = require('underscore');
var translator = require('../../app/js/translators/translatorProxy.js');


describe('Translator', function() {

    it('Test translator proxy with default (memory) translator API', function(done) {
        translator.translate({text: 'brief', from: 'en', to: 'ru'}).then(function(translate) {
            expect(JSON.parse(translate).responseData.translatedText).to.be.equal('Краткое обобщение');
            done();
        });
    });

    it('Test translator proxy defaults', function(done) {
        translator.translate({text: 'brief'}).then(function(translate) {
            expect(JSON.parse(translate).responseData.translatedText).to.be.equal('Краткое обобщение');
            done();
        });
    });

    it('Test translator proxy throw Error if you do not specify text to be translated', function() {
        expect(translator.translate.bind(translator, {from: 'en', to: 'ru'})).to.throw(Error, 'You did not specified text to translate');
    });

    it('Test switching translator APIs on the fly', function(done) {
        this.timeout(10000);
        translator.setTranslator('memory').translate({text: 'brief'}).then(function(translate1) {
            expect(JSON.parse(translate1).responseData.translatedText).to.be.equal('Краткое обобщение');

            translator.setTranslator('bing').translate({text: 'brief'}).then(function(translate2) {
                expect(translate2).to.be.equal('Краткий');
                done();
            });
        });
    });

    it('Test Error on switching to API that does not exist', function() {
        expect(translator.setTranslator.bind(translator, 'non-existed-translator')).to.throw(Error, 'Did not find any translator with name non-existed-translator');
    });



});
