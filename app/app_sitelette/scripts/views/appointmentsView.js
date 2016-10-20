/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    eventActions = require('../actions/eventActions'),
    sessionActions = require('../actions/sessionActions.js'),
    popupController = require('../controllers/popupController'),
    h = require('../globalHelpers'),
    template= require('ejs!../templates/appointmentsView.ejs');

var AppointmentsView = Backbone.View.extend({
    name: 'appointments',
    id: 'cmtyx_appointments',

    events: {
        
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.render();
    },
    render: function(data){
        this.$el.html(template(data));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent : function (options){
        return this.$el;
    },

    onShow:  function() {
        loader.hide();
        this.initCallendar();
    },

    getAppointmentsUrl: function () {
        return eventActions.getAppointmentsUrl({
            UID: sessionActions.getCurrentUser().getUID(),
            serviceAccommodatorId: this.sasl.sa(), 
            serviceLocationId: this.sasl.sl()
        });
    },

    initCallendar: function(UID) {
        var appointmentURL = this.getAppointmentsUrl();

        this.$('#calendar').fullCalendar({
            height: 'parent',
            header: {
                left: 'prev',
                center: 'title',
                right: 'today, listDay,listWeek, next'
            },

            themeButtonIcons: {
                prev: 'left-single-arrow cmtyx_text_color_1 glyphicon glyphicon-circle-arrow-left',
                next: 'right-single-arrow cmtyx_text_color_1 glyphicon glyphicon-circle-arrow-right',
            },

            views: {
                listDay: { buttonText: 'list day' },
                listWeek: { buttonText: 'list week' }
            },
            theme: true,
            defaultView: 'listWeek',
            defaultDate: '2016-10-16',
            navLinks: true, 
            editable: false,
            eventLimit: true,
            // events: [
            //     {
            //         title: 'All Day Event',
            //         start: '2016-10-16',
            //         id: '23BBB'
            //     },
            //     {
            //         title: 'Long Event',
            //         start: '2016-10-17',
            //         end: '2016-10-19',
            //         id: 1
            //     },
            //     {
            //         id: 999,
            //         title: 'Repeating Event',
            //         start: '2016-10-19T16:00:00',
            //     },
            //     {
            //         id: 999,
            //         title: 'Repeating Event',
            //         start: '2016-10-19T16:00:00',
            //     },
            //     {
            //         title: 'Conference',
            //         start: '2016-10-20',
            //         end: '2016-10-21',
            //         id: 1
            //     },
            //     {
            //         title: 'Meeting',
            //         start: '2016-10-21T10:30:00',
            //         end: '2016-10-21T12:30:00',
            //         id: 1
            //     },
            //     {
            //         title: 'Lunch',
            //         start: '2016-10-21T12:00:00',
            //         id: 1
            //     },
            //     {
            //         title: 'Meeting',
            //         start: '2016-10-21T14:30:00',
            //         id: 1
            //     },
            //     {
            //         title: 'Happy Hour',
            //         start: '2016-10-21T17:30:00',
            //         id: 1
            //     },
            //     {
            //         title: 'Dinner',
            //         start: '2016-10-21T20:00:00',
            //         id: 1
            //     },
            //     {
            //         title: 'Birthday Party',
            //         start: '2016-10-22T07:00:00',
            //         id: 1
            //     },
            //     {
            //         title: 'end',
            //         start: '2016-10-22',
            //         id: 1
            //     }
            // ],
            eventClick : function(calEvent, jsEvent, view) {
                if (typeof calEvent.cmtyx === 'undefined'
                || calEvent.cmtyx !== 'NOT_AVAILABLE') {
                    loader.show();
                    eventActions.bookAppointment(calEvent.id, 
                        this.sasl.sa(), 
                        this.sasl.sl())
                    .then(function(response) {
                        if (response.success === true) {
                            this.$('#calendar').fullCalendar('refetchEvents');
                            loader.hide();
                            popupController.textPopup(
                                { text: 'You successfully booked event.' });
                        } else {
                            this.$('#calendar').fullCalendar('refetchEvents');
                            popupController.textPopup(
                                { text: 'Sorry, event isn\'t available already.' });
                        }
                    }.bind(this), function(jqXHR, error, errorThrown) {
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
                        loader.showFlashMessage(h().getErrorMessage(error, msg));
                    }.bind(this));
                }
            }.bind(this),
            events : {
                url : appointmentURL,
                error : function(jqXHR, error, errorThrown) {
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

                    loader.showFlashMessage(h().getErrorMessage(error, msg));
                },
                success : function(e) {
                    $('#calendarLoading').slideUp("slow");
                }
            }
        });
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = AppointmentsView;
