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
			'change': 'render',
			'select': 'triggerSelected'
		},
		triggers: {
			'click': 'user:selected'
		},
		triggerSelected: function() {
			this.trigger('user:selected', this);
		}
	});
	var ChatUsersView = Mn.CollectionView.extend({
		tagName: 'ul',
		className: 'chat-users',
		childView: UserView,
		collectionEvents: {
		    unselect: 'onUnselectAll'
		},
		onChildviewUserSelected: function(selectedView) {
			this.children.each(function(view){
				if (view === selectedView) {
					view.$el.addClass('selected');
				} else {
					view.$el.removeClass('selected');
				}
			});
			this.trigger('user:selected', selectedView.model);
		},
		onUnselectAll: function() {
			this.children.each(function(view){
				view.$el.removeClass('selected');
			});
		}
	});
	return ChatUsersView;
});