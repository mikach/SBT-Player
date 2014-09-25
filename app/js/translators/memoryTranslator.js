'use strict';

var rp = require('request-promise');

var memoryTranslator = (function(){

    return {
        translate: function(opts) {
            var reqOpts = {
                uri: 'http://api.mymemory.translated.net/get?q=' + encodeURIComponent(opts.text) + '&langpair=' + opts.from + '|' + opts.to,
                method: 'GET'
            };
            return rp(reqOpts);
        }
    };
})();

module.exports = memoryTranslator;