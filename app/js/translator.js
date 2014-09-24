'use strict';

var querystring = require('querystring');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var Promise = require('bluebird').Promise;
var rp = require('request-promise');
var _ = require('underscore');

var bingTokenPromise = (function() {

    var token, timeout, timeReserve = 5, isInitialized = false, lastPromise, intervalId;

    var requestOpts = {
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

    var renewToken = function() {
        lastPromise = rp(requestOpts);
        lastPromise.then(function(data) {
            token = JSON.parse(data);
        });
    };

    return {
        get: function() {
            if (!lastPromise) {
                lastPromise = rp(requestOpts);
            }
            return lastPromise;
        },

        /*
         * For test purposes
         */
        _getToken: function() {
            return token;
        },

        _mockRenewalPeriod: function(mockInterval) {
            clearInterval(intervalId);
            intervalId = setInterval(renewToken, mockInterval);
        },

        _isInitialized: function() {
            return isInitialized;
        },

        _init: function(token) {
            isInitialized = true;
            timeout = token.expires_in;
            intervalId = setInterval(renewToken, timeout - timeReserve);
        }
    };
})();

var translator = (function() {

    var getTranslatePromise = function (opts) {

        var checkAndSetDefaults = function (opts) {
            if (!opts || _.isUndefined(opts.text)) {
                throw Error('You did not specified text to translate');
            }
            if (_.isUndefined(opts.from)) {
                opts.from = 'en';
            }
            if (_.isUndefined(opts.to)) {
                opts.to = 'ru';
            }
            return opts;
        };

        return bingTokenPromise.get().then(function(data) {
            if (!bingTokenPromise._isInitialized()) {
                bingTokenPromise._init(JSON.parse(data));
            }

            var token = JSON.parse(data);
            var urlOpts = checkAndSetDefaults(opts);

            return new Promise(function(resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open('GET', 'http://api.microsofttranslator.com/v2/Http.svc/Translate?from=' + urlOpts.from + '&to=' + urlOpts.to + '&text=' + urlOpts.text, true);
                xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token.access_token);

                xmlhttp.onload = function() {
                    if (xmlhttp.status === 200) {
                        resolve(xmlhttp.responseText.replace(/\<([^>]+)\>/, '').replace(/\<\/([^>]+)\>/, ''));
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
    }

    return {
        translate: getTranslatePromise,
        _getBingTokenPromise: function() {
            return bingTokenPromise;
        }
    };
})();

module.exports = translator;