'use strict';

var Backbone = require('../libs/backbone');

var FileReader = window.FileReader;

module.exports = Backbone.View.extend({
    el: '#main',

    events: {
        'dragover': 'dragover',
        'drop': 'drop',
        'click .control.play': 'play',
        'click .control.pause': 'pause',
        'click .progress': 'setVideoPosition'
    },

    initialize: function() {
        this.$player = this.$('video');
        this.$progress = this.$('.control.progress');

        this.video = this.$player[0];

        this.video.addEventListener('timeupdate', this.syncProgressBar.bind(this), false);
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
            self.$player.append(source);
            self.startPlayMode();
        };
        reader.readAsDataURL(file);
    },

    play: function(e) {
        this.video.play();
        Backbone.$(e.target).removeClass('play').addClass('pause');
    },

    pause: function(e) {
        this.video.pause();
        Backbone.$(e.target).addClass('play').removeClass('pause');
    },

    startPlayMode: function() {
        this.$el.addClass('playmode');
        this.video.play();
    },

    syncProgressBar: function() {
        var currentTime = this.video.currentTime,
            duration = this.video.duration;

        var per = Math.floor(currentTime / duration * 100);

        this.$progress.css('width', per + '%');
    },

    setVideoPosition: function(e) {
        var per = e.pageX / Backbone.$(window.document).width();

        this.video.currentTime = Math.floor(this.video.duration * per);
    }
});
