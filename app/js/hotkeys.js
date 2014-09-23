'use strict';

var key = require('keymaster');

var hotkeys = {
    'space': function() {
        console.log('space');
    }
};

module.exports.bindAll = function() {
    Object.keys(hotkeys).forEach(function(k) {
        key(k, hotkeys[k]);
    });
};
