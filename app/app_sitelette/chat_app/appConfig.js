/*global define, window */

'use strict';

var APIRoot = community.protocol + community.server,
	WSRoot = community.wsProtocol + community.server,
	apiSufix = '/apptsvc/rest',
	wsSufix = window.saslData.domainEnum === 'SIMFEL' ? 
		'/apptsvc/ws/user/gamingsecret' : '/apptsvc/ws/sasl/gamingsecret';

module.exports = {
    getAPIRoot: function() {
    	return APIRoot + apiSufix;
    },

    getWebSocketRoot: function() {
    	return WSRoot + wsSufix;
    },
};
