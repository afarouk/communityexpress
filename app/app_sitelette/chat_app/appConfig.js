/*global define, window */

'use strict';

var APIRoot = 'simfel.com',//'54.191.91.125',
	WSRoot = 'simfel.com',//'54.191.91.125',
	apiSufix = '/apptsvc/rest',
	wsSufix = '/apptsvc/ws/sasl/gamingsecret', //SASL to user chat signals
	wsChatAppSufix = '/apptsvc/ws/user/gamingsecret' //user to user chat signals

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
			return 'ws://' + WSRoot + (window.saslData.domainEnum === 'SIMFEL' ? wsChatAppSufix : wsSufix);
		} else {
			return 'wss://' + WSRoot + (window.saslData.domainEnum === 'SIMFEL' ? wsChatAppSufix : wsSufix);
		}
    },
};
