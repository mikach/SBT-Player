'use strict';

var Backbone = require('backbone');
var parser = require('subtitles-parser');
var fs = require('fs');
var appRoot = require('app-root-path');

var Subtitle = require('../models/subtitle');

var Subtitles = Backbone.Collection.extend({
    model: Subtitle,
    index: 0,

    next: function() {
        return (this.index < this.length) ? this.at(this.index++) : null;
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
            currentIndex = Math.floor((minIndex + maxIndex) / 2) || 0;
            currentElement = array[currentIndex];

            if (currentElement.containMoment(moment) > 0) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement.containMoment(moment) < 0) {
                maxIndex = currentIndex - 1;
            }
            else {
                this.index = currentIndex + 1;
                return array[currentIndex];
            }
        }
        return null;
    }
}, {
    /**
     * @relativePath path to *.srt file relatively project root
     * Returns {@code Subtitles} collection from the *.srt file
     */
    fromFile: function(relativePath) {
        var srt = fs.readFileSync(appRoot + '/' + relativePath).toString('utf8');
        var data = parser.fromSrt(srt, true);
        var subtitles = new Subtitles();
        subtitles.add(data);
        return subtitles;
    }
});

module.exports = Subtitles;
