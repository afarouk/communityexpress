/*global define*/

'use strict';

var configurationActions = require('../../actions/configurationActions');

var PanelView = function(options) {

    options = options || {};
    this.parent = options.parent;

    this.inheritedEvents = [];

    Backbone.View.call(this, options);

    this.$el.attr({
        'data-role': 'panel',
        'data-theme': 'a',
        'data-position': 'left',
        'data-display': 'overlay',
        'data-position-fixed': true,
        'data-dismissible': true,
        'data-swipe-close': false,
        //TODO hacked styles
        'class': 'popup_container panel ui-panel ui-panel-position-left ui-panel-display-overlay ui-body-a ui-panel-fixed ui-panel-animate'
    });

    if ( this.parent ) {
        this.user = this.parent.user;
        this.listenTo( this.parent, 'hide', this.shut, this);
        this.listenTo( this.parent, 'close:all', this.shut, this);
    }
};

_.extend(PanelView.prototype, Backbone.View.prototype, {
    // el: '.popup_container',

    pageEvents: {
        'panelclose':'_onClose',
        'panelopen':'_onOpen',
        'click .close_button': 'shut',
        'click .cmntyex-button-cancel': 'shut'
    },

    addEvents: function(eventObj) {
        var events = _.extend( {}, eventObj, this.pageEvents );
        this.delegateEvents(events);
    },

    afterRender: function() {
        $('.popup_container').html('');
        this.$el.appendTo('.popup_container');
    },

    render: function() {
        this.viewModel = this.model ? ( this.model.attributes || this.collection ) : this.collection;
        this.$el.html(this.template( _.extend( this.viewModel, this.renderData ) ) );
        this.afterRender(); // call it by default for each panel
        return this;
    },

    enhance: function(){
        this.$el.panel();
        this.$('.outside').insertBefore('.ui-panel-inner');
        this.$el.trigger('create');
    },

    open: function() {
        this.$el.panel('open');
        return this;
    },

    shut: function() {
        if(this.$el.hasClass('ui-panel')){
            this.$el.panel('close');
            return this;
        } else {
            this._onClose();
        }
    },

    toggle: function() {
        this.$el.panel('toggle');
        return this;
    },

    _onOpen: function() {
        this.trigger('open');
        $('.ui-panel-dismiss' ).addClass('needsclick').css('margin-top','-50px');
        $('#cmntyex_menu_panel').siblings('.ui-panel-dismiss').css('left','146px');
    },

    _onClose: function() {
        this.trigger('close:all');
        this.undelegateEvents();
        this.remove();
    }

});

PanelView.extend = Backbone.View.extend;

module.exports = PanelView;
