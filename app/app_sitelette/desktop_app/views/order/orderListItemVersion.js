'use strict';

define([
	'ejs!../../templates/order/orderListItemVersion.ejs'
	], function(template){
	var OrderListItemVersionView = Mn.View.extend({
		template: template,
		className: 'order_list_item',
		tagName: 'li',
		ui: {
			increase: '[name="quantity_increase"]',
			decrease: '[name="quantity_decrease"]',
			remove: '[name="remove_item"]'
		},
		events: {
			'click @ui.increase': 'onIncrease',
			'click @ui.decrease': 'onDecrease'
		},
		triggers: {
			'click @ui.remove': 'item:remove'
		},
		initialize: function() {
		},
		serializeData: function() {
			var t1 = this.model.get('version1DisplayText'),
                t2 = this.model.get('version2DisplayText'),
                t3 = this.model.get('version3DisplayText'),
				versionText = (t1 ? t1 : '') + (t2 ? ' ,' + t2 : '') + (t3 ? ' ,' + t3 : '');
			return _.extend(this.model.toJSON(), {
				versionText: versionText,
				customizationNote: this.model.get('customizationNote') || null
			});
		},
		onIncrease: function() {
			var quantity = this.model.get('quantity') + 1;
			this.model.set('quantity', quantity);
		},
		onDecrease: function() {
			var quantity = this.model.get('quantity');
			quantity = quantity > 0 ? quantity - 1 : 0;
			this.model.set('quantity', quantity);
		},
	});

	return OrderListItemVersionView;
});