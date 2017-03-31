'use strict';

define([
	'./orderListItem'
	], function(OrderListItemView){
	var OrderListView = Mn.CollectionView.extend({
		childView: OrderListItemView,
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