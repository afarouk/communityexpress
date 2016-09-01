/*global define*/

'use strict';

var template = require('ejs!../../templates/openingHours.ejs'),
    PopupView = require('../components/popupView'),
    h = require('../../globalHelpers');

var OpeningHoursView = PopupView.extend({

    template: template,

    id: 'cmntyex_opening_hours_popup',

    className: 'popup',

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

    render: function () {
        this.$el.html(this.template({ hours: this._parseHours(this.model) }));
        return this;
    }

});

module.exports = OpeningHoursView;
