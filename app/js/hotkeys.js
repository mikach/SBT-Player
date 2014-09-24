'use strict';

var key = require('keymaster');
var events = require('./events');

var hotkeys = {
    'space': 'EVENT_SPACEKEY',
    'right': 'EVENT_RIGHTKEY',
    'left': 'EVENT_LEFTKEY'
};

module.exports.bindAll = function() {
    Object.keys(hotkeys).forEach(function(k) {
        if (typeof hotkeys[k] === 'function') {
            key(k, hotkeys[k]);
        } else {
            key(k, events.trigger.bind(events, hotkeys[k]));
        }
    });
};
