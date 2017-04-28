'use strict';

define([
	'ejs!../../templates/popups/loader.ejs',
	], function(template){
	var LoaderView = Mn.View.extend({
		template: template,
		className: 'loader-popup',
     	show: function() {
     		this.$el.dialog('open');
     		this.$el.prev().remove();
     		this.$el.parent().css('background-color', 'transparent');
               $('.cmtyx_desktop_application').addClass('with-blur');
               $('.ui-dialog-titlebar-close').click(function() {
                    $('.cmtyx_desktop_application').removeClass('with-blur');
               });
     	},
     	hide: function() {
     		this.$el.dialog('close');
     	}
	});
	return LoaderView;
});