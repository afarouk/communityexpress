'use strict';

define([
	'ejs!../../templates/popups/loader.ejs',
	], function(template){
	var LoaderView = Mn.View.extend({
		template: template,
		className: 'loader-popup',
		ui: {

		},
		events: {

		},
		initialize: function() {
			this.$el.dialog({ 
				autoOpen: false,
				closeOnEscape: true,
				draggable: false,
				resizable: false,
				modal: true
			});
		},
     	show: function() {
     		this.$el.dialog('open');
     	},
     	hide: function() {
     		this.$el.dialog('close');
     	}
	});
	return LoaderView;
});