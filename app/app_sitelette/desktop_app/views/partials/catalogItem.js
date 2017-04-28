define([
	'ejs!../../templates/partials/catalogItem.ejs',
	'./customizationLayout'
	], function(itemTemplate, CustomizationLayoutView){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item',
		tagName: 'li',
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
			details: '[name="extra-details"]',
			detailsImage: '[name="details-image"]'
		},
		events: {
			'click @ui.increase': 'onIncrease',
			'click @ui.decrease': 'onDecrease',
			'click @ui.customize': 'onCustomize',
			'click' : 'onExtraDetailsToggle'
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
					.triggerMethod('customizeItem', this);
			}

			e.preventDefault();
			e.stopPropagation();
		},

		onExtraDetailsToggle: function(e) {
			if ($(e.target).parents('#customizationContainer').length > 0) return;
			var urls = this.model.get('mediaURLs');
	    	if (!urls && !urls[0]) return;
	    	var src = this.ui.detailsImage.attr('src');
	    	if (src) {
	    		this.trigger('extra:details', this);
	    	} else {
	    		this.ui.detailsImage.on('load', function(){
	    			this.trigger('extra:details', this);
	    		}.bind(this));
	    		this.ui.detailsImage.attr('src', urls[0]);
	    	}
		}
	});

	return CatalogGroupItemView;
});