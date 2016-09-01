/*global define*/

'use strict';

var ContentView = Backbone.View.extend({

    events: {
        'pageshow': 'onPageShow',
        'pagebeforehide': 'onPageBeforeHide',
        'pagehide': 'onPageHide'
    },

    initialize: function(options) {
        this.template = options.template;
    },

    render: function(data){
        this.$el.html(this.template(data));
        this.setElement(this.$el.find('.page'));
        return this;
    },

    onPageShow: function() {
        this.trigger('show');
    },

    onPageBeforeHide: function(){
        this.trigger('beforehide');
    },

    onPageHide: function() {
        this.trigger('hide');
        this.remove();
    },

});

module.exports = ContentView;
