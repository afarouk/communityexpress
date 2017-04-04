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

     		if( this.options.loader ) {
		 		setTimeout(function(){
				    this.onClose();
				}.bind(this), 2000);
			}
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     		this.callback();
     	}
	});
	return MessageView;
});