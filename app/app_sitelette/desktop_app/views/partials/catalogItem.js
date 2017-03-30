define([
	'ejs!../../templates/partials/catalogItem.ejs',
	], function(itemTemplate){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item',
		tagName: 'li',
		triggers: {
			
		}
	});

	return CatalogGroupItemView;
});