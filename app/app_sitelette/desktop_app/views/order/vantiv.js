'use strict';

define([
	'ejs!../../templates/order/vantiv.ejs',
	], function(template){
	var VantivView = Mn.View.extend({
		name: 'vantiv',
		template: template,
		className: 'page vantiv_page',
		ui: {
			iframe: '[name="vantiv-iframe"]'
		},
		initialize: function() {
		},
		onRender: function() {
			$(window).off('message').on('message', function(e){
	            var data = e.originalEvent.data;
				if(data.type=="vantiv.success"){
					this.trigger('vantiv.success', data.vantiv, data.code);
				}
	        }.bind(this));
		}
	});
	return VantivView;
});