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
				return CatalogItemView;
			}
		},
		initialize: function(options) {
			console.log(this.collection.toJSON());
			this.basket = options.basket;
			this.options = options;
		},
		onChildviewItemsAdded: function(childView, event) {
			var model = childView.model;
			this.dispatcher.get('customize')
				.checkCustomization(childView, model)
				.then(function(model){
					this.basket.addItem(model, model.get('quantity'), 
						 this.options.groupId, this.options.groupDisplayText, 
						 this.options.catalogId,this.options.catalogDisplayText);
					if (model.get('wasCustomized')) {
						childView.triggerMethod('closeCustomization');
					}
				}.bind(this));

			event.preventDefault();
			event.stopPropagation();
		},
		onChildviewItemsVersionAdded: function(childView,  basketItem) {
			this.dispatcher.get('customize')
				.checkCustomization(childView, basketItem)
				.then(function(model){
					console.log(model.toJSON());
					this.basket.addItem(model, 1,
						 this.options.groupId, this.options.groupDisplayText, 
						 this.options.catalogId,this.options.catalogDisplayText);
					if (model.get('wasCustomized')) {
						childView.triggerMethod('closeCustomization');
					}
				}.bind(this));
		},
		onChildviewItemsCustomized: function(childView) {
			this.children.each(function(view) {
				if(view !== childView) {
					view.getRegion('customization').$el.slideUp('slow');
					view.ui.customMark.removeClass('visible');
					view.ui.customize.removeClass('opened');
				}
			});
		},

		onChildviewExtraDetails: function(childView) {
			this.children.each(function(view) {
				if(view === childView) {
					view.ui.details.toggle('slow');
				} else {
					view.ui.details.slideUp('slow');
				}
			});
		}

	});
	return CatalogGroupView;
});