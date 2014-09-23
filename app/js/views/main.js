'use strict';

var Backbone = require('../libs/backbone');

var FileReader = window.FileReader;

module.exports = Backbone.View.extend({
    el: '#main',

    events: {
        'dragover': 'dragover',
        'drop': 'drop',
        'click .button.play': 'play',
        'click .button.pause': 'pause'
    },

    initialize: function() {
        this.player = this.$('video');
    },

    dragover: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    drop: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var self = this;

        var files = e.originalEvent.dataTransfer.files;

        // for (var i = 0; i < files.length; i++) {
        //     console.log(files[i].path);
        // }
        var file = files[0];

        var reader = new FileReader();
        reader.onload = function (event) {
            // console.log(event.target);
            var source = Backbone.$('<source src="' + event.target.result + '" ></source>');
            self.player.append(source);
            self.startPlayMode();
        };
        reader.readAsDataURL(file);
    },

    play: function(e) {
        this.player[0].play();
        Backbone.$(e.target).removeClass('play').addClass('pause');
    },

    pause: function(e) {
        this.player[0].pause();
        Backbone.$(e.target).addClass('play').removeClass('pause');
    },

    startPlayMode: function() {
        this.$el.addClass('playmode');
    }
});
