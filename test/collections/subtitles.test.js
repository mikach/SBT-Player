var expect = require('chai').expect;
var Backbone = require('backbone');

var Subtitles = require('../../app/js/collections/subtitles');

describe('Subtitles Collection', function() {
    it('should be a Backbone.Collection', function() {
        expect(Subtitles.prototype).to.be.instanceOf(Backbone.Collection);
    });

    // TODO

});
