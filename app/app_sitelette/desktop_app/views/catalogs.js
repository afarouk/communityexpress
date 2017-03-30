'use strict';

define([
	'ejs!../templates/catalogs.ejs',
	'ejs!../templates/catalogsItem.ejs',
	], function(template, itemTemplate){

	var CatalogsItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog',
		tagName: 'li',
		triggers: {
			'click': 'select:catalog'
		},

	});

	var CatalogsCollectionView = Mn.CollectionView.extend({
		childView: CatalogsItemView,
		className: 'catalogs_list',
		tagName: 'ul',
		initialize: function() {
			console.log(this.collection.toJSON());
		},
		onChildviewSelectCatalog: function(childView) {
			this.trigger('catalog:selected', childView.model.get('catalogId'));
		}
	});

	var CatalogsView = Mn.View.extend({
		template: template,
		className: 'catalog_main_container',
		regions: {
			catalogs: '#catalogs-collection'
		},
		initialize: function(options) {
			this.options = options;
		},
		onRender: function() {
			var collectionView = new CatalogsCollectionView({
				collection: this.options.catalogsCollection
			});
			this.showChildView('catalogs', collectionView);
			this.listenTo(collectionView, 'catalog:selected', this.onCatalogSelected.bind(this));
		},
		onCatalogSelected: function(catalogId) {
			this.trigger('catalog:selected', catalogId);
		}
	});

	return CatalogsView;
});