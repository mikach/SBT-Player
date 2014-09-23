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
        'click .progress-wrap': 'setVideoPosition'
    },

    initialize: function() {
        this.$player = this.$('video');
        this.$progress = this.$('.control .progress');

        this.$btn = this.$('.control.play');

        this.video = this.$player[0];

        this.video.addEventListener('timeupdate', this.syncProgressBar.bind(this), false);
        this.video.addEventListener('play', this.syncBtn.bind(this), false);
        this.video.addEventListener('pause', this.syncBtn.bind(this), false);
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
            var source = Backbone.$('<source src="' + event.target.result + '" ></source>');
            self.$player.append(source);
            _currentWindow_.title = file.name;
            self.startPlayMode();
        };
        reader.readAsDataURL(file);
    },

    play: function() {
        this.video.play();
    },

    pause: function() {
        this.video.pause();
    },

    startPlayMode: function() {
        this.$el.addClass('playmode');
        this.video.play();
    },

    // endPlayMode: function() {
    //     this.$player.children().remove();
    //     this.$el.removeClass('playmode');
    // },

    syncBtn: function() {
        if (!this.video.paused) {
            this.$btn.removeClass('play').addClass('pause');
        } else {
            this.$btn.addClass('play').removeClass('pause');
        }
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
