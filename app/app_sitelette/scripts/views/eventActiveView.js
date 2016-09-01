/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PageLayout = require('./components/pageLayout'),
    ListView = require('./components/listView'),
    eventActions = require('../actions/eventActions'),
    h = require('../globalHelpers');

module.exports = PageLayout.extend({

    name: 'eventActive',

    renderData: function () {
        return { attrs: this.attrs};
    },

    initialize: function(options) {
        this.options = options || {};
        this.attrs = this.options.eventAttrs;
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
    },

    onShow: function(){
        this.addEvents({
            'click .back': 'triggerLandingView'
        });
        $('.theme2_event_banner_wrapper').css('margin-top', '30px');
        $('.theme2_event_entry_right_top_row_calendar').find('a').css({
            'color': '#FFF',
            'text-align': 'center',
            'font-weight': '0100'
        });
    },

    triggerLandingView: function() {
        Vent.trigger('viewChange', 'restaurant', this.sasl.getUrlKey(), { reverse: true })
    }

});