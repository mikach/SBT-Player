'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Subtitle = Backbone.Model.extend({
    defaults: {
        'startTime': '',
        'endTime': '',
        'text': ''
    },

    validate: function(attrs) {
        if (_.isUndefined(attrs.startTime) || _.isUndefined(attrs.endTime) || _.isUndefined(attrs.text)) {
            return 'You missed one of the attributes';
        }
        if (attrs.startTime > attrs.endTime) {
            return 'startTime cannot be greater than endTime';
        }
    },

    /**
     * Compare two time periods
     * @param that Subtitle with which we compare the current one
     * @returns {number} positive if {@code this} is greater than {@code that}, negative if {@code this} is less than {@code that}
     * and zero if they are equals or overlaps or one time period contains another.
     */
    equals: function(that) {
        if (!(that instanceof Subtitle)) {
            throw Error('Cannot compare with element that does not belong to Subtitle type');
        }

        if (this.get('startTime') > that.get('endTime')) {
            return 1;
        } else if (that.get('startTime') > this.get('endTime')) {
            return -1;
        } else {
            return 0;
        }
    },

    /**
     *
     * @param moment moment for which we need to find a time period
     * @returns {number} positive if {@code moment} belongs to time period greater than {@code this},
     * negative if {@code moment} belongs to time period less than {@code this}
     * and zero if the curect time period contain the {@code moment}.
     */
    containMoment: function(moment) {
        if (!(_.isNumber(moment) && _.isFinite(moment))) {
            throw Error('Moment should be an Integer');
        }

        if (moment >= this.get('startTime') && moment <= this.get('endTime')) {
            return 0;
        } else if (moment < this.get('startTime')) {
            return -1;
        } else if (moment > this.get('endTime')) {
            return +1;
        } else {
            throw Error('Impossible case :-)');
        }
    }
});

module.exports = Subtitle;