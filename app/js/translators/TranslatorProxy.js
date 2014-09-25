'use strict';

var _ = require('underscore');
var memoryTranslator = require('./memoryTranslator');
var bingTranslator = require('./bingTranslator');

var translatorProxy = (function() {

    var translator = memoryTranslator;

    var checkAndSetDefaults = function (opts) {
        if (!opts || _.isUndefined(opts.text)) {
            throw new Error('You did not specified text to translate');
        }
        if (_.isUndefined(opts.from)) {
            opts.from = 'en';
        }
        if (_.isUndefined(opts.to)) {
            opts.to = 'ru';
        }
        return opts;
    };

    return {
        setTranslator: function(translatorName) {
            switch (translatorName) {
                case 'bing': translator = bingTranslator; return this;
                case 'memory': translator = memoryTranslator; return this;
                default: throw new Error('Did not find any translator with name ' + translatorName);
            }
        },

        translate: function(opts) {
            return translator.translate(checkAndSetDefaults(opts));
        }
    };
})();

module.exports = translatorProxy;