'use strict';

var gateway = require('../APIGateway/gateway');

module.exports = {
    updateLoyaltyStatus: function(UID) {
      var jqScreenWidth=$( window ).width();
         return gateway.sendRequest('retrieveLoyaltyStatus', {
            UID: UID,
            screenWidth:jqScreenWidth,
            serviceAccommodatorId: window.saslData.serviceAccommodatorId,
            serviceLocationId: window.saslData.serviceLocationId
        });
    },


// The below code will be changed in correct way
    retrieveCalendar: function(UID) {
        var urlPrefix = community.protocol+community.server+'/apptsvc/rest/';
        var appointmentURL = urlPrefix + "appointments/fc_retrieveEvents";
        appointmentURL = this.buildUrl(appointmentURL, 'UID', UID);
        appointmentURL = this.buildUrl(appointmentURL, "serviceAccommodatorId",
        window.saslData.serviceAccommodatorId);
        appointmentURL = this.buildUrl(appointmentURL, "serviceLocationId",
        window.saslData.serviceLocationId);

        $('#calendar').fullCalendar(
            {
                contentHeight : 475,
                displayEventTime : false,
                displayEventEnd : false,
                minTime : "09:00:00",
                maxTime : "17:00:00",
                header : {
                left : 'title',
                right : 'prev,next today',
                center : null
                // center: 'title',
                // right: 'month,basicWeek,basicDay'
            },
            views : {
                agendaDay : { // name of view
                titleFormat : 'MMM D \'YY',
                allDaySlot : false
                // other view-specific options here
                }
            },
            defaultDate: '2015-12-05',
            defaultView : 'agendaDay',
            editable : false,
            eventLimit : true, // allow "more" link when too many events
            eventClick : function(calEvent, jsEvent, view) {
                if (typeof calEvent.cmtyx === 'undefined'
                || calEvent.cmtyx !== 'NOT_AVAILABLE') {
                    $.ajax({
                        url : calEvent.apiURL,
                        data : "", // 'type=changetitle&title='+title+'&eventid='+event.id,
                        type : 'PUT',
                        dataType : 'json',
                        success : function(response) {
                            $('#calendarSuccess').html("Success");
                            $('#calendarSuccess').slideDown("slow");
                            setTimeout(function() {
                                $('#calendarSuccess').slideUp();
                                }, 2000);
                            if (response.success === true) {
                                $('#calendar').fullCalendar('refetchEvents');
                            } else {
                                $('#calendarWarning').html("Error:" + response.explanation);
                                $('#calendarWarning').slideDown("slow");
                                setTimeout(function() {
                                    $('#calendarWarning').slideUp();
                                }, 2000);
                            }
                        },
                        error : function(jqXHR, error, errorThrown) {
                            $('#calendarSuccess').hide();
                            $('#calendarLoading').hide();
                            var msg = "Service unavailable";
                            if (typeof jqXHR !== 'undefined') {

                                try {
                                    var errorObj = JSON.parse(jqXHR.responseText);
                                    msg = errorObj.error.message;
                                } catch (error) {
                                    msg = 'Service unavailable';
                                }
                            } else {
                                msg = jqXHR.responseText;
                            }

                            $('#calendarWarning').html("Error:" + msg);
                            $('#calendarWarning').slideDown("slow");
                            setTimeout(function() {
                                $('#calendarWarning').slideUp();
                            }, 5000);
                        }
                    });

                }

            },
            events : {
                url : appointmentURL,
                error : function(jqXHR, error, errorThrown) {
                    // var errorObj = JSON.parse(jqXHR);
                    $('#calendarSuccess').hide();
                    $('#calendarLoading').hide();

                    var msg = "Service not available";
                    if (typeof jqXHR.error !== 'undefined') {
                        try {
                            var errorObj = JSON.parse(jqXHR.responseText);
                            msg = errorObj.error.message;
                        } catch (exception) {
                            msg = "Service unavailable";
                        }

                    } else {
                        msg = jqXHR.responseText;
                    }

                    $('#calendarWarning').html("Error:" + msg);
                    $('#calendarWarning').slideDown("slow");

                    $('#calendar').slideUp("slow");
                },
                success : function(e) {
                    $('#calendarLoading').slideUp("slow");
                }
            }
        });
    },

    buildUrl: function(a, b, c) {
        var d = a.indexOf("?") > -1 ? "&" : "?";
        return a + d + b + "=" + c;
    }
}
