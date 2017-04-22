/*global define, window */

    'use strict';

    define([

        ], function(){
        var productionRoot = community.protocol+community.server+'/apptsvc/rest',
            config = {
                defaultErrorMsg: 'An error has occurred',
                timeoutErrorMessage: 'Error: the internet connectivity might be too slow',
                authorizationErrorMsg: 'Please sign in to use this feature',
                apiRoot: productionRoot,
                productionRoot: productionRoot,
                simulateRoot: community.protocol+community.server+'/apptsvc/rest',
                imagePath: 'images/',
                defaultLocation: [37.7833, -122.4167],
            };

        return config;
    });
