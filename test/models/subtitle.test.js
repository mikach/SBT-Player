var expect = require('chai').expect;
var Backbone = require('backbone');

var Subtitle = require('../../app/js/models/subtitle');

describe('Subtitles Model', function() {
    it('should be a Backbone.Model', function() {
        expect(Subtitle.prototype).to.be.instanceOf(Backbone.Model);
    });

    // TODO

});
