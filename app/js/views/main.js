'use strict';

var Backbone = require('../libs/backbone');
var events = require('../events');
var Subtitles = require('../collections/subtitles');

// var FileReader = window.FileReader;

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

        this.$subtitles = this.$('.control.subtitles');

        this.video.addEventListener('timeupdate', this.syncProgressBar.bind(this), false);
        this.video.addEventListener('timeupdate', this.syncSubtitles.bind(this), false);
        this.video.addEventListener('play', this.syncBtn.bind(this), false);
        this.video.addEventListener('pause', this.syncBtn.bind(this), false);

        this.listenTo(events, 'EVENT_SPACEKEY', this.togglePlayPause);
        this.listenTo(events, 'EVENT_RIGHTKEY', this.nextVideoPosition);
        this.listenTo(events, 'EVENT_LEFTKEY', this.prevVideoPosition);
    },

    dragover: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    drop: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var files = e.originalEvent.dataTransfer.files;
        var videoFile, subtitlesFile;

        for (var i = 0; i < files.length; i++) {
            if (files[i].path.split('.').pop() === 'mp4') {
                videoFile = files[i];
            }
            if (files[i].path.split('.').pop() === 'srt') {
                subtitlesFile = files[i];
            }
        }

        if (videoFile) {
            var source = Backbone.$('<source src="' + videoFile.path + '" ></source>');
            this.$player.append(source);
            _currentWindow_.title = videoFile.name;
            this.startPlayMode();
        }

        if (subtitlesFile) {
            this.subtitles = Subtitles.fromFile(subtitlesFile.path);
            console.table(this.subtitles.toJSON());
        }
    },

    play: function() {
        this.video.play();
    },

    pause: function() {
        this.video.pause();
    },

    togglePlayPause: function() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
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

    syncSubtitles: function() {
        var currentTime = this.video.currentTime * 1000, // ms
            sub, html;

        if (this.subtitles) {
            // var sub = this.subtitles.get(5);
            sub = this.subtitles.getByMoment(currentTime);
            html = sub ? this.textToSubtitle(sub.get('text')) : '';
            this.$subtitles.html(html);
        }
    },

    setVideoPosition: function(e) {
        var per = e.pageX / Backbone.$(window.document).width();

        this.video.currentTime = Math.floor(this.video.duration * per);
    },

    nextVideoPosition: function() {
        this.video.currentTime += 5;
    },

    prevVideoPosition: function() {
        this.video.currentTime -= 5;
    },

    textToSubtitle: function(text) {
        return text.split(' ').map(function(word) {
            return '<span>' + word + '</span>';
        }).join('');
    }
});
