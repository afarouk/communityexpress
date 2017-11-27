/*global define */

'use strict';

define([
	'ejs!../templates/chatUsersModal.ejs',
	'./chatUsers'
	], function(template, ChatUsersView){
	var ChatUsersModalView = Mn.View.extend({
		template: template,
		regions: {
			users: '[name="chat-users"]'
		},
		ui: {
			addContact: '[name="add-contact"]'
		},
		triggers: {
			'click @ui.addContact': 'user:add'
		},
		onRender: function() {
			this.onShowUsers();
		},
		onShowUsers: function() {
			var users = new ChatUsersView({
				collection: this.options.collection
			});
			this.showChildView( 'users', users );
			this.listenTo(users, 'user:selected', this.onUserSelected.bind(this));
		},
		onUserSelected: function(model) {
			this.trigger('user:selected', model);
		}
	});
	return ChatUsersModalView;
});