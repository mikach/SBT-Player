var expect = require('chai').expect;
var Collection = require('backbone').Collection;

var Subtitles = require('../../app/js/collections/subtitles');
var Subtitle = require('../../app/js/models/subtitle');

describe('Subtitles Collection', function() {

    var create = function(text, start, end) {
        return new Subtitle({'text': text, startTime: start, endTime: end});
    };

    var subtitlesArray = [
        create('First',  0,    1000),
        create('Second', 1001, 2000),
        create('Third',  2001, 3000),
        create('Fifth',  4001, 5000)
    ];

    it('should be a Backbone.Collection', function() {
        expect(Subtitles.prototype).to.be.instanceOf(Collection);
    });

    it('Test next iteration', function() {
        var subtitles = new Subtitles(subtitlesArray);
        expect(subtitles.next().get('text')).to.be.equal('First');
        expect(subtitles.next().get('text')).to.be.equal('Second');
        expect(subtitles.next().get('text')).to.be.equal('Third');
        expect(subtitles.next().get('text')).to.be.equal('Fifth');
        expect(subtitles.next()).to.be.null;
    });

    it('Test get by moment', function() {
        var subtitles = new Subtitles(subtitlesArray);
        expect(subtitles.getByMoment(1001).get('text')).to.be.equal('Second');
        expect(subtitles.getByMoment(2000).get('text')).to.be.equal('Second');
        expect(subtitles.getByMoment(1500).get('text')).to.be.equal('Second');
        expect(subtitles.getByMoment(3001)).to.be.null;
    });

    it('Test mixed iteration', function() {
        var subtitles = new Subtitles(subtitlesArray);
        expect(subtitles.getByMoment(2500).get('text')).to.be.equal('Third');
        expect(subtitles.next().get('text')).to.be.equal('Fifth');
        expect(subtitles.getByMoment(0).get('text')).to.be.equal('First');
        expect(subtitles.next().get('text')).to.be.equal('Second');
        expect(subtitles.getByMoment(99999)).to.be.null;
        expect(subtitles.next().get('text')).to.be.equal('Third');
    });

    it('Test creating from file', function() {
        var subtitles = Subtitles.fromFile('test/resources/Subtitles_sample.srt');
        expect(subtitles.getByMoment(12000).get('text')).to.be.equal('Oh, God!' + "\n" + 'Is he just the sweetest thing?');
        expect(subtitles.next().get('endTime')).to.be.equal(17946);
        expect(subtitles.length).to.be.equal(336);
    });
});
