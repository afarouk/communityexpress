/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    h = require('../globalHelpers'),
    template= require('ejs!../templates/businessHours.ejs');

var BusinessHours = Backbone.View.extend({
    name: 'business_hours',
    id: 'cmtyx_businessHours',
    
    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        if (options.error) {
            loader.showFlashMessage('error retrieving opening hours');
            setTimeout(this.goBack.bind(this), 0);
        } else {
            loader.hide();
            this.render(this._parseHours(options.hours));
        }
    },
    render: function(hours){
        this.$el.html(template({ hours:hours } ));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    /* AF: we don't need this function. It was part of the
       old PageLayout based layout management. We leave
       it here for now, while we continue clean up */
    renderContent : function (options){
        return this.$el;
    },

    _parseHours: function (data) {
        var dayStrings = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        var hours = [];
        _.each(data.shiftPolicies, function (shift, i) {
            _.each(shift.weekDayPolicies, function (v, k) {
                var index = dayStrings.indexOf(k);
                if (v && v.maxSeatCount == -2) {
                    hours[index] = hours[index] || [k];
                    hours[index].push('closed');
                } else if (v && v.timeRange) {
                    hours[index] = hours[index] || [k];
                    hours[index].push(h().toTwoDigit(v.timeRange.openingHours.startClock.hour) +
                            ':' + h().toTwoDigit(v.timeRange.openingHours.startClock.minute));
                    hours[index].push(h().toTwoDigit(v.timeRange.openingHours.endClock.hour) +
                            ':' + h().toTwoDigit(v.timeRange.openingHours.endClock.minute));
                } else {
                    hours[index] = hours[index] || [k];
                }
            });
        });
        return hours;
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = BusinessHours;
