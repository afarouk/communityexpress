'use strict';

define([
	'./catalogItem',
	'./catalogItemVersions'
	], function(CatalogItemView, CatalogItemVersionsView){

	var CatalogGroupView = Mn.CollectionView.extend({
		className: 'cmtyx_catalog',
		tagName: 'ul',
		childView: function(model){
			if (model.get('hasVersions')) {
				return CatalogItemVersionsView;
			} else {
				model.set('hasSubItems', true); //temporary until you'll add 'hasSubitems' field
				return CatalogItemView;
			}
		},
		initialize: function(options) {
			console.log(this.collection.toJSON());
			this.basket = options.basket;
			this.options = options;
		},
		getVersionsFromBasket: function(model) {
	        var versionsFromBasket = this.basket.getBasketVersions(model) || null,
	            versions = [];

	        if (!versionsFromBasket) return versions;
	        _.each(versionsFromBasket.selectedVersions, function(version){
	            versions.push({
	                version: version.version,
	                selected: version.selected,
	                quantity: version.quantity
	            });
	        });

	        return versions;
	    },
		onChildviewItemsAdded: function(childView) {
			var model = childView.model;
			this.dispatcher.get('customize')
				.checkCustomization(childView)
				.then(function(){
					this.basket.addItem(model, model.get('quantity'), 
						 this.options.groupId, this.options.groupDisplayText, 
						 this.options.catalogId,this.options.catalogDisplayText);
				}.bind(this));
		},
		onChildviewItemsVersionAdded: function(childView,  basketItem) {
			this.dispatcher.get('customize')
				.checkCustomization(childView)
				.then(function(model){
					//TODO that is not correct only temporary
					basketItem.set('hasSubItems', model.get('hasSubItems') || false);
					basketItem.set('customizationNote', model.get('customizationNote') || null);
					basketItem.set('wasCustomized', model.get('wasCustomized') || false);
					basketItem.set('price', model.get('price') || basketItem.get('price'));
					//temporary tweak
					//todo replace note with spacial ids mark
					basketItem.set('uuid', basketItem.get('uuid') + '[' + escape(model.get('customizationNote')) + ']' || false);
					this.basket.addItem(basketItem, 1,
						 this.options.groupId, this.options.groupDisplayText, 
						 this.options.catalogId,this.options.catalogDisplayText);
				}.bind(this));
		},
		onChildviewItemsCustomized: function(childView) {
			this.children.each(function(view) {
				if(view !== childView) {
					view.getRegion('customization').$el.slideUp('slow');
					view.ui.customize.removeClass('opened');
				}
			});
		}
	});
	return CatalogGroupView;
});