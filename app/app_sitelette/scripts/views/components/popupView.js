/*global define*/

'use strict';

var PopUpView = function(options) {

    options = options || {};

    this.parent = options.parent;
    this.inheritedEvents = [];

    if ( options.template ) {
        this.template = options.template;
    }

    Backbone.View.call(this, options);

    this.$el.attr({
        'data-role': 'popup',
        'data-transition': 'fade',
        'data-position': 'window',
        'data-overlay-theme': 'b',
        'data-theme': 'b',
        // TODO temporary solution hard added 'ui-popup ui-body-b ui-overlay-shadow ui-corner-all'
        // strange bug in jquery.mobile when switch to another view 
        // after that 'popup' method works differante
        'class': 'popup_container popup ui-popup ui-body-b ui-overlay-shadow ui-corner-all'
    });

};

_.extend(PopUpView.prototype, Backbone.View.prototype, {

    el: '.popup_container',

    pageEvents: {
        'click .close_button': 'shut',
        'popupafterclose': 'close',
        'popupafteropen': 'onShow',
        'popupbeforeposition': 'beforeShow'
    },

    events: function() {
        var e = _.extend({}, this.pageEvents);

        _.each(this.inheritedEvents, function(events) {
            e = _.extend(e, events);
        });

        return e;
    },

    onShow: function(){},

    addEvents: function(eventObj) {
        // this.inheritedEvents.push(eventObj);
        var events = _.extend( {}, eventObj, this.pageEvents );
        this.delegateEvents(events);
    },

    render: function() {
        this.viewModel = this.model ? ( this.model.attributes || this.collection ) : this.collection;
        this.$el.html(this.template( _.extend( {}, this.viewModel, this.renderData ) ) );
        return this;
    },

    enhance: function() {
        this.$el.popup();
        this.$el.trigger('create');
    },

    open: function() {
        this.$el.popup('open');
    },

    shut: function() {
        this.$el.popup('close');
    },

    close: function() {
        this.trigger('closed');
        this.undelegateEvents();
        this.$el.popup('destroy');
        this.$el.html('');
        // this.remove();
    }

});

PopUpView.extend = Backbone.View.extend;

module.exports = PopUpView;
