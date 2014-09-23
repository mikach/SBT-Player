global._currentWindow_ = require('nw.gui').Window.get();
global._currentWindow_.showDevTools();

var View = require('./js/views/main');

new View();
