/*global define */

'use strict';

define([
    '../appConfig',
    '../globalHelpers',
    ], function( config, h ){
    var UrlController = Mn.Object.extend({
        checkOptions: function() {
            var search = Backbone.history.getSearch().replace('?', ''),
                params = h().parseQueryString(search);
            if (params) {
                if(params.server) {
                    config.setAPIRoot(params.server);
                }
            }
        }
    });

    return new UrlController();
});
