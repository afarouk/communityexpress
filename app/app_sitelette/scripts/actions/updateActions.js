'use strict';

module.exports = {

    openCustomURLinIFrame: function(a) {
        var b = document.documentElement;
        var c = document.createElement("IFRAME");
        c.setAttribute("src", a);
        b.appendChild(c);
        c.parentNode.removeChild(c);
    },

    iosJavascriptLogin: function(a, b, c, d) {
        var e = "js2ios://community_login";
        e = e + "?functionName=" + a;
        console.log("url being invoked:" + e);
        openCustomURLinIFrame(e);
    },

    IOSLoginSucceeded: function(a, b) {
        console.login("IOSloginSucceeded:" + a + ", " + b);
        require([ "./sessionActions" ], function(c) {
        c.setUser(a, b);
        });
    },

    buildUrl: function(a, b, c) {
        var d = a.indexOf("?") > -1 ? "&" : "?";
        return a + d + b + "=" + c;
    },

    initOwlCarousel: function() {
        $('#media_carousel').owlCarousel({ 
            items:1,
            loop:true,
            margin:0,
            autoplay:true,
            autoplayTimeout:3000,
            dots:false,
            animateOut:'fadeOut',
            animateIn:'fadeIn'
        });
    },

    pollContestAction: function(uuid,choice) {
        if (typeof choice !== 'undefined') {
            $('#' + uuid + ' input[type=radio]').attr('disabled', true);
            $('#' + uuid + ' a').fadeTo('slow', .3).removeAttr('href');
            $('#' + uuid + ' a').off();
            var url = community.protocol + community.server + '/apptsvc/rest/contests/enterPollAnonymous';
            console.log(' url:' + url);
            var data = {
                'choiceId' : choice,
                'serviceAccommodatorId' : community.serviceAccommodatorId,
                'serviceLocationId' : community.serviceLocationId,
                'contestUUID' : uuid
            };
            $(event.target).fadeOut('slow');
            $('#pollresultsplot' + uuid).fadeIn('slow');
            $(document).ready(function() {
                console.log('starting');
                var request = $.ajax({
                headers : {
                    Accept : 'application/json;charset=utf-8'
                },
                type : 'POST',
                url : url,
                contentType : 'application/json;charset=utf-8',
                data : JSON.stringify(data)
                }).done(function(response) {
                    console.log('done:');
                    var dataArray = response.dataArray, options = response.options;
                    options.seriesDefaults.renderer = eval(options.seriesDefaults.renderer);
                    options.axes.yaxis.renderer = eval(options.axes.yaxis.renderer);
                    options.axes.yaxis.rendererOptions.tickRenderer = eval(options.axes.yaxis.rendererOptions.tickRenderer);
                    $.jqplot('pollresultsplot' + uuid, dataArray, options);
                }).fail(function(e, o) {
                    console.log('Request failed: ' + o);
                    if ('undefined' != typeof e.responseJSON && 'undefined' != typeof e.responseJSON.error)
                    console.log(' Error:' + e.responseJSON.error.message);
                }).always(function() {
                    console.log(' All done');
                });
            });
        }
    }

};
