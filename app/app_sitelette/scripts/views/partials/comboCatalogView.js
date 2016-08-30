/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/comboCatalog.ejs'),
    Vent = require('../../Vent'),
    CatalogItemView = require('./catalog_item'),
    CatalogRadioItemView = require('./catalog_radio_item'),  
    CatalogCheckboxItemView = require('./catalog_checkbox_item'),
    ListView = require('../components/listView'),
    ListCheckboxView = require('../components/listCheckboxView'),
    ListRadioView = require('../components/listRadioView');

var ComboCatalogView = Backbone.View.extend({

    template: template,

    initialize: function (options) {
        this.color = options.color;
        this.onChange = options.onChange;
        this.listenTo(options.parent, 'close:all', this.onClose, this);
    },

    render: function () {
        var el = document.createElement('div');
        el.innerHTML = this.template(_.extend({}, this.model, {color: this.color}));
        $(el).enhanceWithin();
        this.renderItems(el);
        this.el = el;
        return this;
    },
 
    renderItems: function (el) {
     
        $(el).find('.cmntyex-list_placeholder').html(new ListRadioView({
            ListItemView: CatalogRadioItemView, 
            ListItemViewOptions: {
            	onChange: function (model) { 
                    this.onChange(model);
                }.bind(this),
                color: this.color,
                radio_group_name:this.model.groupId,//'groupname',
                dataRole:'listview',
                icon:true
            },
            className: 'cmntyex-catalog',
            collection: new Backbone.Collection(this.model.unSubgroupedItems),
            update: false,
            parent: this
        }).render().el);
    },

    onClose: function () {
        this.trigger('close:all');
    }

});

module.exports = ComboCatalogView;
