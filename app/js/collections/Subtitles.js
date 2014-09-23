'strict mode'

var Backbone = require('backbone');

var Subtitle = require('./js/models/subtitle')

module.exports = Backbone.Collection.extend({
    model: Subtitle,
    index: 0,

    next: function() {
        return this.at(this.index++);
    },

    getByMoment: function(moment) {
        return this._binarySearch(this.toArray(), moment);
    },

    _binarySearch: function(array, moment) {
        var minIndex = 0;
        var maxIndex = array.length - 1;
        var currentIndex;
        var currentElement;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = array[currentIndex];

            if (currentElement.containMoment(moment) > 0) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement.containMoment(moment) < 0) {
                maxIndex = currentIndex - 1;
            }
            else {
                return array[currentIndex];
            }
        }

        throw Error('No subtitle for this moment');
    }
});