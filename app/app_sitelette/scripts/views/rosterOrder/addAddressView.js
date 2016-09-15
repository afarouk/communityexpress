'use strict';

var Vent = require('../../Vent'),
    template = require('ejs!../../templates/rosterOrder/addAddress.ejs');

var AddAddressView = Backbone.View.extend({

	name: 'add_address',

    id: 'cmtyx_add_address',

	initialize: function(options) {
		this.options = options || {};
        this.on('show', this.onShow, this);
        this.render();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    onShow: function() {
        this.addEvents({
            'click .nav_next_btn': 'triggerPayment',
            'click .nav_back_btn': 'goBack',
            'change #aptBldgInput': 'onAptBldgChanged',
            'change #streetInput': 'onStreetChanged',
            'change #cityInput': 'onCityChanged',
        });
    },

    renderContent: function (options){
        return this.$el;
    },

    renderData: function() {
    	return _.extend(this.model.toJSON(), {
    		cs: this.model.additionalParams.symbol
    	});
    },

    triggerPayment: function() {
        if (this.validate()) {
            Vent.trigger('viewChange', 'payment', {
                model: this.model, 
                backTo: 'add_address'
            });
        } else {
            //TODO show errors
        }
    },

    validate: function() {
        return true;
    },

    goBack : function() {
        Vent.trigger('viewChange', 'address', this.model);
    },

    onAptBldgChanged: function(e) {
        var value = this.getValue(e);
        this.model.get('deliveryAddress').number = value;
    },

    onStreetChanged: function(e) {
        var value = this.getValue(e);
        this.model.get('deliveryAddress').street = value;
    },

    onCityChanged: function(e) {
        var value = this.getValue(e);
        this.model.get('deliveryAddress').city = value;
    },

    getValue: function(e) {
        var target = $(e.currentTarget);
        return target.val();
    }

});

module.exports = AddAddressView;
