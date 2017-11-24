/*global define */

'use strict';

define([
	'ejs!../templates/chatUser.ejs'
	], function(template){
	var UserView = Mn.View.extend({
		tagName: 'li',
		className: '',
		template: template,
		modelEvents: {
			'change': 'render'
		},
		triggers: {
			'click': 'user:selected'
		}
	});
	var ChatUsersView = Mn.CollectionView.extend({
		tagName: 'ul',
		className: 'chat-users',
		childView: UserView,
		onChildviewUserSelected: function(selectedView) {
			this.children.each(function(view){
				if (view === selectedView) {
					view.$el.addClass('selected');
				} else {
					view.$el.removeClass('selected');
				}
			});
			this.trigger('user:selected', selectedView.model);
		}
	});
	return ChatUsersView;
});