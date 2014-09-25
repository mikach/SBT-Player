'use strict';

/* jshint camelcase:false */

var querystring = require('querystring');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
/* global -Promise */
var Promise = require('bluebird').Promise;
var rp = require('request-promise');

var bingTokenProm = (function() {

    var authOpts = {
        encoding: 'utf8',
        uri: 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13',
        method: 'POST',
        body: querystring.stringify({
            'client_id': 'Subtitles',
            'client_secret': 'Xv2Oae6Vki4CnYcSF1SxSSBtO1x4rX47zhLUE/OqVds=',
            'scope': 'http://api.microsofttranslator.com',
            'grant_type': 'client_credentials'
        })
    };

    var intervalId, promise = rp(authOpts);

    /**
     * Make promise renew each {@code (timeout - timeReserve)} seconds
     */
    (function() {
        var timeReserve = 5;
        promise.then(function(data) {
            var interval = 1000 * (JSON.parse(data).expires_in - timeReserve);
            intervalId = setInterval(function() {
                promise = rp(authOpts);
            }, interval);
        });
    })();

    return {
        get: function() {
            return promise;
        },

        _mockRenewalPeriod: function(newInterval) {
            clearInterval(intervalId);
            intervalId = setInterval(function() {
                promise = rp(authOpts);
            }, newInterval);
        }
    };
})();

var bingTranslator = (function() {

    var getTranslateProm = function (opts) {

        return bingTokenProm.get().then(function(data) {

            return new Promise(function(resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open('GET', 'http://api.microsofttranslator.com/v2/Http.svc/Translate?from=' + opts.from + '&to=' + opts.to + '&text=' + opts.text, true);
                xmlhttp.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(data).access_token);
                xmlhttp.onload = function() {
                    if (xmlhttp.status === 200) {
                        resolve(xmlhttp.responseText.replace(/<([^>]+)\>/, '').replace(/<\/([^>]+)\>/, ''));
                    }
                    else {
                        reject(Error(xmlhttp.statusText));
                    }
                };
                xmlhttp.onerror = function() {
                    reject(Error('Network Error'));
                };
                xmlhttp.send();
            });
        });
    };

    return {
        translate: getTranslateProm,
        _getTokenProm: function() {
            return bingTokenProm.get();
        },
        _mockRenewalPeriod: function(newInterval) {
            bingTokenProm._mockRenewalPeriod(newInterval);
        }
    };
})();

module.exports = bingTranslator;