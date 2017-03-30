define([
	'ejs!../../templates/partials/catalogItemVersions.ejs',
	], function(itemTemplate){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item item_with_versions',
		tagName: 'li',
		triggers: {
			
		},
		events: {
			'click .add_to_cart_btn': 'onAddtoCard'
		},
		onAddtoCard: function() {
			this.$('.item_added_versions').css('display', 'flex');
		}
	});

	return CatalogGroupItemView;
});