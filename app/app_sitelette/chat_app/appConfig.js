/*global define, window */

'use strict';

var APIRoot = 'simfel.com',//'54.191.91.125',
	WSRoot = 'simfel.com',//'54.191.91.125',
	apiSufix = '/apptsvc/rest',
	wsSufix = '/apptsvc/ws/sasl/gamingsecret',
	wsChatAppSufix = '/apptsvc/ws/gaming/gamingsecret'

module.exports = {
	setAPIRoot: function(server) {
    	APIRoot = server;
    },

    getAPIRoot: function() {
    	if(APIRoot === 'localhost:8080' || APIRoot === '54.191.91.125') {
	        return 'http://' + APIRoot + apiSufix;
		} else {
			return 'https://' + APIRoot + apiSufix;
		}
    },

    getWebSocketRoot: function() {
        if ( WSRoot === 'localhost:8080' || WSRoot === '54.191.91.125') {
			return 'ws://' + WSRoot + (window.saslData.domainEnum === 'SECURECHAT' ? wsChatAppSufix : wsSufix);
		} else {
			return 'wss://' + WSRoot + (window.saslData.domainEnum === 'SECURECHAT' ? wsChatAppSufix : wsSufix);
		}
    },
};
