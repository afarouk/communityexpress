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
			this.collection.removeItem(model);
			if (model.get('isVersion')) {
				this.collection.removeVersion(model);
			}
		}
	});

	return OrderListView;
});