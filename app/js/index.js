global._currentWindow_ = require('nw.gui').Window.get();
global._currentWindow_.showDevTools();

global.document = window.document;

require('./js/hotkeys').bindAll();

var View = require('./js/views/main');

new View();
