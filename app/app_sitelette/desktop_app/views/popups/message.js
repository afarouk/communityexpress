'use strict';

define([
	'ejs!../../templates/popups/message.ejs',
	], function(template){
	var MessageView = Mn.View.extend({
		template: template,
		className: 'message-popup',
		ui: {
			ok_btn: '.ok_btn'
		},
		events: {
			'click @ui.ok_btn': 'onClose'
		},
		initialize: function() {
			
		},
     	onShow: function(messageText, withLoader) {
     		var self = this;
     		this.$el.dialog('open');
     		this.$el.find('.message-text').html(messageText);
     		this.$el.prev().find('.ui-dialog-title').hide();
     		this.$el.prev().find('button').hide();

     		if( withLoader ) {
     			this.$el.find('.ok_btn').hide();
     			this.$el.find('.loader').show();
     			this.$el.addClass('with-loader');
		 		setTimeout(function(){
				    self.onClose();
				}, 3000);
     		}
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	}
	});
	return MessageView;
});