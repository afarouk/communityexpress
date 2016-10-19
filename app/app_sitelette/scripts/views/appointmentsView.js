/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
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
        this.appointments = new Backbone.Collection(options.appointments);
        this.on('show', this.onShow, this);
        this.render({appointments: options.appointments});
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
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = AppointmentsView;
