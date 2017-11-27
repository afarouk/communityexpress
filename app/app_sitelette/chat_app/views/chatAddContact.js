/*global define */

'use strict';

define([
	'ejs!../templates/chatAddContact.ejs',
	'./chatUsers'
	], function(template, ChatUsersView){
	var ChatAddContactView = Mn.View.extend({
		template: template,
		ui: {
			byMobile: '[name="by-mobile"]',
			byEmail: '[name="by-email"]',
			addContact: '.add-contact-by',
			number: '[name="mobile"]',
			email: '[name="email"]',
			sendNumber: '[name="send-mobile"]',
			sendEmail: '[name="send-email"]',
		},
		events: {
			'click @ui.byMobile': 'onByMobileClicked',
			'click @ui.byEmail': 'onByEmailClicked',
			'keypress @ui.number': 'onEnterOnNumber',
			'keypress @ui.email': 'onEnterOnEmail',
			'click @ui.sendNumber': 'onMobileSend',
			'click @ui.sendEmail': 'onEmailSend'
		},
		triggers: {
			
		},
		onRender: function() {
			
		},

		onByMobileClicked: function() {
			this.ui.byMobile.addClass('selected');
			this.ui.byEmail.removeClass('selected');
			this.ui.addContact.removeClass('email').addClass('mobile');
			this.ui.number.focus();
		},
		onByEmailClicked: function() {
			this.ui.byMobile.removeClass('selected');
			this.ui.byEmail.addClass('selected');
			this.ui.addContact.removeClass('mobile').addClass('email');
			this.ui.email.focus();
		},
		onEnterOnNumber: function(e) {
			if (e.charCode === 13) {
				e.preventDefault();
				e.stopPropagation();
				this.onMobileSend();
				return false;
			}
		},
		onEnterOnEmail: function(e) {
			if (e.charCode === 13) {
				e.preventDefault();
				e.stopPropagation();
				this.onEmailSend();
				return false;
			}
		},

		onMobileSend: function() {
			var val = this.ui.number.val();
			this.trigger('chat:send:mobile', val, this.onMobileError.bind(this));
		},
		onEmailSend: function() {
			var val = this.ui.email.val();
			this.trigger('chat:send:email', val, this.onEmailError.bind(this));
		},

		onMobileError: function(xhr) {
			debugger;
		},
		onEmailError: function(xhr) {
			debugger;
		},
	});
	return ChatAddContactView;
});