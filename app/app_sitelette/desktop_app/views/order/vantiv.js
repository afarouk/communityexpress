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
			window.addEventListener('message',function(message){
			  if(message.data.type=="vantiv.success"){
			    this.trigger('vantiv.success', message.data.status);
			  }
			}.bind(this));
		}
	});
	return VantivView;
});