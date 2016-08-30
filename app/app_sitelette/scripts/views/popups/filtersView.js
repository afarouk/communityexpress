/*global define*/

'use strict';

var template = require('ejs!../../templates/filters.ejs'),
    loader = require('../../loader'),
    filtersController = require('../../controllers/filtersController'),
    PanelView = require('../components/panelView');

var FiltersView = PanelView.extend({

    template: template,

    selectCategory: '#cmntyex_select-category',
    selectDomain: '#cmntyex_select-business',

    initialize: function(){

        this.$el.attr({
            'id': 'cmntyex_filters_popup'
        });

        this.addEvents({
            'click .submit_button': '_onSubmit',
            'click .cancel_button': 'shut',
            'click .reset_button': '_reset',
            'panelbeforeopen': '_setDomain',
            'change #cmntyex_select-business': '_onDomainChange'
        });

    },

    render: function () {
        this.$el.html(this.template({domains: this.collection}));
        return this;
    },

    _reset: function () {
        var domain = this.collection.at(0);
        $(this.selectDomain).val(domain.id).selectmenu('refresh').trigger('change');
    },

    _setDomain: function () {
        var domain = this.collection.getSelected();
        $(this.selectDomain).val(domain.id).selectmenu('refresh').trigger('change');
    },

    _onSubmit: function () {
        var domain = $(this.selectDomain).val();
        this.collection.selectDomain(domain);
        this.shut();
    }

});

module.exports = FiltersView;
