'use strict';

var Vent = require('../../Vent'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache'),
    template = require('ejs!../../templates/rosterOrder/vantiv.ejs');

var VantivView = Backbone.View.extend({

	name: 'vantiv',

    id: 'cmtyx_vantiv',

	initialize: function(options) {
		this.options = options || {};
        this.on('show', this.onShow, this);
        this.render();

        $(window).off('message').on('message', function(e){
            var data = e.originalEvent.data;
          if(data.type=="vantiv.success"){
            this.onVantivResponse(data.status);
          }
        }.bind(this));
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    onShow: function() {
        
    },

    renderContent: function (){
        return this.$el;
    },

    renderData: function() {
        return this.model.toJSON();
    },

    onVantivResponse: function(response) {
        Vent.trigger('viewChange', 'summary', {
            model: this.model,
            fromVantiv: {
                response: response,
                validationCode: this.model.get('validationCode')
            },
            backTo: 'payment'
        });
    },
});

module.exports = VantivView;
