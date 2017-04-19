'use strict';

define([
	'./customizationItem',
	], function(CustomizationItemView, CatalogItemVersionsView){
	var CustomizationCollectionView = Mn.CollectionView.extend({
		className: 'customization_block',
		tagName: 'ul',
		childView: CustomizationItemView,
		initialize: function() {
			console.log(this.collection.toJSON());
		},
		selected: {
			quantity: 0
		},
		childViewOptions: function() {
			return _.extend(this.options, {
				selected: this.selected
			});
		}
	});
	return CustomizationCollectionView;
});