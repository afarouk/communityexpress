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
			increase: '[name="quantity_increase"]',
			decrease: '[name="quantity_decrease"]',
			quantity: '[name="quantity"]',
			price: '[name="items_price"]',
			addToCard: '[name="add_to_card"]',
		},
		events: {
			'click @ui.increase': 'onIncrease',
			'click @ui.decrease': 'onDecrease',
			'click @ui.customize': 'onCustomize'
		},
		triggers: {
			'click @ui.addToCard': 'items:added',
			'click @ui.customize': 'items:customized'
		},
		quantity: 1,
		// onRender: function() {
	 //    	this.$el.addClass(this.getColor());
	 //    	this.$el.find('.item_title').addClass(this.getTextColor());
  //       	this.$el.find('.item_description').addClass(this.getTextColor());
	 //    },
	 //    getColor: function() {
	 //        var colors = [ 'cmtyx_color_2', 'cmtyx_color_4' ],
	 //            index = this.model.collection.indexOf(this.model);
	 //        return colors[index % colors.length];
	 //    },

	 //    getTextColor: function(index) {
	 //        var colors = [ 'cmtyx_text_color_2', 'cmtyx_text_color_4' ],
	 //            index = this.model.collection.indexOf(this.model);
	 //        return colors[index % colors.length];
	 //    },
	    
		onIncrease: function() {
			this.quantity++;
			this.ui.quantity.text(this.quantity);
			this.model.set('quantity', this.quantity);
			// this.changeItemsPrice(); //Ravi told that we don't need that
		},
		onDecrease: function() {
			this.quantity = this.quantity > 1 ? this.quantity - 1 : 1;
			this.ui.quantity.text(this.quantity);
			this.model.set('quantity', this.quantity);
			// this.changeItemsPrice();
		},
		changeItemsPrice: function() {
			var price = this.model.get('price') * this.quantity;
			this.ui.price.text(price.toFixed(2));
		},
		onCustomize: function() {
			this.dispatcher.get('customize')
				.triggerMethod('customizeItem', this);
		}
	});

	return CatalogGroupItemView;
});