'use strict';

define([
	'./orderListItem',
	'./orderListItemVersion'
	], function(OrderListItemView, OrderListItemVersionView){
	var OrderListView = Mn.CollectionView.extend({
		childView: function(model) {
			if (model.get('isVersion')) {
				return OrderListItemVersionView;
			} else {
				return OrderListItemView;
			}
		},
		className: 'order_list',
		tagName: 'ul',
		initialize: function() {
			console.log(this.collection.toJSON());
		},
		onChildviewItemRemove: function(view) {
			var model = view.model;
			this.collection.remove(model);
		}
	});

	return OrderListView;
});