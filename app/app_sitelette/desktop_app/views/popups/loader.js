'use strict';

define([
	'ejs!../../templates/popups/loader.ejs',
	], function(template){
	var LoaderView = Mn.View.extend({
		template: template,
		className: 'loader-popup',
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
     		this.$el.prev().find('.ui-dialog-title').hide();
     		this.$el.prev().find('button').hide();
     	},
     	hide: function() {
     		this.$el.dialog('close');
     	}
	});
	return LoaderView;
});