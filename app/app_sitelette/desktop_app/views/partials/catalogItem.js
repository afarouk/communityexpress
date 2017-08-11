define([
	'ejs!../../templates/partials/catalogItem.ejs',
	'./customizationLayout',
	'./extraDetails'
	], function(itemTemplate, CustomizationLayoutView, extraDetailsBehavior){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item',
		tagName: 'li',
		behaviors: [extraDetailsBehavior],
		regions: {
			customization: '#customizationContainer'
		},
		ui: {
			customize: '[name="item_customize"]',
			customMark: '[name="customization-mark"]',
			increase: '[name="quantity_increase"]',
			decrease: '[name="quantity_decrease"]',
			quantity: '[name="quantity"]',
			price: '[name="items_price"]',
			addToCart: '[name="add_to_cart_btn"]',
			details: '[name="extra-details"]'
		},
		events: {
			'click @ui.increase': 'onIncrease',
			'click @ui.decrease': 'onDecrease',
			'click @ui.customize': 'onCustomize'
		},
		triggers: {
			'click @ui.addToCart': 'items:added',
			'click @ui.customize': 'items:customized'
		},
		quantity: 1,
	    
		onIncrease: function() {
			this.quantity++;
			this.ui.quantity.text(this.quantity);
			this.model.set('quantity', this.quantity);
		},
		onDecrease: function() {
			this.quantity = this.quantity > 1 ? this.quantity - 1 : 1;
			this.ui.quantity.text(this.quantity);
			this.model.set('quantity', this.quantity);
		},
		changeItemsPrice: function() {
			var price = this.model.get('price') * this.quantity;
			this.ui.price.text(price.toFixed(2));
		},
		onCustomize: function(e) {
			var $el = this.getRegion('customization').$el;
			this.ui.customMark.removeClass('visible');
			if ($el.is(':visible')) {
				$el.slideToggle('slow');
				this.ui.customize.removeClass('opened')
			} else {
				this.dispatcher.get('customize')
					.triggerMethod('customizeItem', this, this.model.get('subItems'));
			}
		}
	});

	return CatalogGroupItemView;
});