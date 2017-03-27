'use strict';

define([
	'ejs!../templates/catalogGroupItem.ejs',
	], function(itemTemplate){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item',
		tagName: 'li',
		triggers: {
			
		}
	});

	var CatalogGroupView = Mn.CollectionView.extend({
		childView: CatalogGroupItemView,
		className: 'cmtyx_catalog',
		tagName: 'ul',
		initialize: function() {
			console.log(this.collection.toJSON());
		},
		onChildviewSelectGroup: function(childView) {
			this.trigger('group:selected', childView.model.get('catalogId'));
		}
	});
	return CatalogGroupView;
});