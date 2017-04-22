'use strict';

define([
	'ejs!../../templates/popups/message.ejs',
	], function(template){
	var MessageView = Mn.View.extend({
		template: template,
		className: 'message-popup',
		ui: {
			ok_btn: '.ok_btn',
			confirm_btn: '.confirm_btn',
			cancel_btn: '.cancel_btn'
		},
		events: {
			'click @ui.cancel_btn': 'onClose',
			'click @ui.ok_btn': 'onConfirm',
			'click @ui.confirm_btn': 'onConfirm'
		},
		initialize: function(options) {
			this.options = options || {};
			this.callback = typeof this.options.callback === 'function' ? this.options.callback : function(){};
		},
		serializeData: function() {
			return {
				loader: this.options.loader,
				confirm: this.options.confirm,
				message: this.options.message || ''
			};
		},
     	onShow: function() {
     		this.$el.dialog('open');
     		this.$el.prev().find('.ui-dialog-title').hide();
     		this.$el.prev().find('button').hide();

     		if( this.options.loader && !this.options.infinite) {
		 		setTimeout(function(){
				    this.onClose();
				}.bind(this), 2000);
			}
     	},
     	onConfirm: function() {
     		this.onClose();
     		this.callback();
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     	}
	});
	return MessageView;
});