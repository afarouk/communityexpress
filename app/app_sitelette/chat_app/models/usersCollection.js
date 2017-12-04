/*global define*/

'use strict';

define([
    'moment',
    '../../scripts/appCache'
    ], function(moment, appCache){
    var ChatUsersModel = Backbone.Model.extend({
        initialize: function() {
            this.setShortName();
            this.setMessageDate();
        },
        setShortName: function() {
            var name = this.get('userName'),
                shortName = (name[0] + name[name.length - 1]).toUpperCase();
            this.set('shortName', shortName, {silent: true});
        },
        setMessageDate: function() {
            var timeOfLastMessage = this.get('timeOfLastMessage'),
                utc = typeof timeOfLastMessage === 'number' ? timeOfLastMessage : timeOfLastMessage.replace(':UTC', ''),
                localDate = moment.utc(utc).local(),
                date = this.getDate(localDate);
            this.set('date', date, {silent: true});
        },
        getDate: function(localDate) {
            return moment(localDate).calendar(null, {
                lastWeek: 'dddd LT',
                lastDay: '[Yesterday] LT',
                sameDay: '[Today] LT',
                sameElse: 'DD/MM/YYYY LT'
            });
        }
    });
    var ChatUsersCollection = Backbone.Collection.extend({
        initialize: function(collection) {
            this.on('change:timeOfLastMessage', this.onTimeOfLastMessageChanged.bind(this));
        },
        model: function(attrs, options) {
            var model = new ChatUsersModel(attrs, options);
            
            return model;
        },
        onTimeOfLastMessageChanged: function(model) {
            model.setMessageDate();
        }
    });
    return ChatUsersCollection;
});