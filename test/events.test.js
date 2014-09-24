var expect = require('chai').expect;
var Backbone = require('backbone');

var events = require('../app/js/events');

describe('Events', function() {
    it('should be a Backbone.Events', function() {
        expect(events).to.eql(Backbone.Events);
    });
});
