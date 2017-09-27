'use strict';

define([
  ], function(){
  var AppointmentsView = Mn.View.extend({
    el: '#cmtyx_appointments_block',
    ui: {

    },
    events: {
      
    },
    initialize: function(options) {
        this.options = options || {};
        this.sasl = window.saslData;
    },

  });

  return AppointmentsView;
});
