var expect = require('chai').expect;
var Backbone = require('backbone');

var Subtitle = require('../../app/js/models/subtitle');

describe('Subtitles Model', function() {
    it('should be a Backbone.Model', function() {
        expect(Subtitle.prototype).to.be.instanceOf(Backbone.Model);
    });

    it('test validate method', function() {
        var subtitle = new Subtitle();
        var attrs1 = {text: 'Hello', endTime: 2000};
        var attrs2 = {text: 'Hello', startTime: 1000};
        var attrs3 = {startTime: 1000, endTime: 2000};
        var attrs4 = {text: 'Hello', startTime: 3000, endTime: 2000};
        expect(subtitle.validate(attrs1)).to.be.equal('You missed one of the attributes');
        expect(subtitle.validate(attrs2)).to.be.equal('You missed one of the attributes');
        expect(subtitle.validate(attrs3)).to.be.equal('You missed one of the attributes');
        expect(subtitle.validate(attrs4)).to.be.equal('startTime cannot be greater than endTime');

    });

    it('test containMoment method', function() {
        var subtitle = new Subtitle({text: 'Hello', startTime: 1000, endTime: 2000});
        expect(subtitle.containMoment(1000)).to.be.equal(0);
        expect(subtitle.containMoment(2000)).to.be.equal(0);
        expect(subtitle.containMoment(1500)).to.be.equal(0);
        expect(subtitle.containMoment(500)).to.be.equal(-1);
        expect(subtitle.containMoment(3000)).to.be.equal(1);
    });

    it('test containMoment throw Error on trying pass illegal (not integer) argument', function() {
        var subtitle = new Subtitle({text: 'Hello', startTime: 1000, endTime: 2000});
        expect(subtitle.containMoment.bind(subtitle, 'second')).to.throw(Error, 'Moment should be an Integer');
    });
});
