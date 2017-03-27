'use strict';

define([
	'ejs!../templates/singleCatalog.ejs',
	'./catalogTabs',
	'./catalogGroup'
	], function(template, CatalogTabsView, CatalogGroupView){
	var SingleCatalogView = Mn.View.extend({
		template: template,
		regions: {
			tabs: '#catalog-tabs',
			group: '#catalog-group'
		},
		className: 'height-100pc',
		events: {
			'click .back_to_catalog_btn': 'onBackToCatalog'
		},
		initialize: function(options) {
			console.log(options);
			this.options = options;
		},
		onRender: function() {
			var groups = new Backbone.Collection(this.options.catalog.collection.groups);
			var catalogTabs = new CatalogTabsView({
				collection: groups
			})
			this.listenTo(catalogTabs, 'group:selected', this.onGroupSelected.bind(this));
			this.showChildView('tabs', catalogTabs);

			var selectedGroup = groups.at(0);
			var groupItems = selectedGroup.get('unSubgroupedItems');
			var groupItemsCollection = new Backbone.Collection(groupItems);

			var catalogGroup = new CatalogGroupView({
				collection: groupItemsCollection
			})
			this.showChildView('group', catalogGroup);
			console.log(groupItemsCollection.toJSON());
		},
		onGroupSelected: function(model) {
			var groupItems = model.get('unSubgroupedItems');
			var groupItemsCollection = new Backbone.Collection(groupItems);

			var catalogGroup = new CatalogGroupView({
				collection: groupItemsCollection
			})
			this.showChildView('group', catalogGroup);
		}, 
		onBackToCatalog: function() {
			this.trigger('backToCatalog');
		}
	});
	return SingleCatalogView;
});