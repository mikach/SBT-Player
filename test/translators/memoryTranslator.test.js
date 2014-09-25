var expect = require('chai').expect;
var translator = require('../../app/js/translators/memoryTranslator.js');

describe('Translator', function() {

    it('Test memory translator', function(done) {
        translator.translate({text: 'Memory', from: 'en', to: 'ru'}).then(function(translate) {
            var translate = JSON.parse(translate);
            expect(translate).not.to.be.undefined;
            var bestTranslate = translate.responseData.translatedText;
            expect(bestTranslate).to.be.equal('Память');
            var matches = translate.matches;
            expect(matches).to.be.an('array');
            expect(matches).not.to.be.empty;
            done();
        });
    });
});