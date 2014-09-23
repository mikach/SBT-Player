'strinct mode'

var parser = require('subtitles-parser');
var fs = require('fs');

var Subtitles = require('./js/collections/subtitles');

module.exports = {

    /**
     * Returns {@code Subtitles} collection from the *.srt file
     */
    parseToCollection: function(path) {
        var srt = fs.readFileSync(path).toString('utf8');
        var data = parser.fromSrt(srt, true);
        var subtitles = new Subtitles();
        subtitles.add(data);
        return subtitles;
    },

    /**
     * Integration Test: test parser and Subtitles collection API
     */
    test: function() {
        var srt = fs.readFileSync('../resources/Subtitles_sample.srt').toString('utf8');
        var data = parser.fromSrt(srt, true);
        var subtitles = new Subtitles();
        subtitles.add(data);
        console.log(subtitles.next().attributes);
        console.log(subtitles.next().attributes);
        console.log(subtitles.next().attributes);
        console.log(subtitles.next().attributes);
        console.log(subtitles.getByMoment(3000).attributes);
    }
}

