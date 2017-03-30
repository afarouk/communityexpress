define([
	'ejs!../../templates/partials/catalogItem.ejs',
	], function(itemTemplate){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item',
		tagName: 'li',
		ui: {
			increase: '[name="quantity_increase"]',
			decrease: '[name="quantity_decrease"]',
			quantity: '[name="quantity"]',
			price: '[name="items_price"]',
			addToCard: '[name="add_to_card"]',
		},
		events: {
			'click @ui.increase': 'onIncrease',
			'click @ui.decrease': 'onDecrease',
			// 'click @ui.addToCard': 'onAddToCard'
		},
		triggers: {
			'click @ui.addToCard': 'items:added'
		},
		quantity: 1,
		onIncrease: function() {
			this.quantity++;
			this.ui.quantity.text(this.quantity);
			this.model.set('quantity', this.quantity);
			this.changeItemsPrice();
		},
		onDecrease: function() {
			this.quantity = this.quantity > 1 ? this.quantity - 1 : 1;
			this.ui.quantity.text(this.quantity);
			this.model.set('quantity', this.quantity);
			this.changeItemsPrice();
		},
		changeItemsPrice: function() {
			var price = this.model.get('price') * this.quantity;
			this.ui.price.text(price.toFixed(2));
		},
		onAddToCard: function() {
			console.log('add to card ' + this.quantity + ' ' + this.model.get('itemName'));
			this.trigger('items:added')
		}
	});

	return CatalogGroupItemView;
});