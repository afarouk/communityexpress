'use strict';

define([
	'ejs!../../templates/popups/expandImage.ejs'
	], function(template){
	var ExpandImageView = Mn.View.extend({
		template: template,

		className: 'expand-image',
		ui: {
			
		},
		events: {
			
		},
		initialize: function(options) {
			this.options = options;
		},
		serializeData: function() {
			return {
				title: this.options.title,
				imgSource: this.options.imgSource
			}
	    },
     	onShow: function () {
     		this.$el.dialog('open');
     		this.$el.prev().find('.ui-dialog-title').hide();
     		$('.cmtyx_desktop_application').addClass('with-blur');
     		this.$el.prev().find('.ui-dialog-titlebar-close').click(function() {
				$('.cmtyx_desktop_application').removeClass('with-blur');
			});
			this.$el.parent().width('480px');
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     		$('.cmtyx_desktop_application').removeClass('with-blur');
     	}
	});
	return ExpandImageView;
});