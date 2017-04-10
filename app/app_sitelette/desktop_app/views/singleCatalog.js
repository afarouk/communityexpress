'use strict';

define([
	'ejs!../templates/singleCatalog.ejs',
	'./catalogTabs',
	'./partials/catalogGroup'
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
		serializeData: function() {
			return {
				catalogId: this.options.catalogId
			};
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

			this.showCatalogGroup(groupItemsCollection, selectedGroup);
			console.log(groupItemsCollection.toJSON());
		},
		onGroupSelected: function(model) {
			var groupItems = model.get('unSubgroupedItems'),
				groupItemsCollection = new Backbone.Collection(groupItems);

			this.showCatalogGroup(groupItemsCollection, model);
		},
		showCatalogGroup: function (groupItemsCollection, selectedGroup) {
			if (this.catalogGroup) {
				this.catalogGroup.remove();
			}
			this.catalogGroup = new CatalogGroupView({
				collection: groupItemsCollection,
				basket: this.options.basket,
				groupId: selectedGroup.get('groupId'),
				groupDisplayText: selectedGroup.get('groupDisplayText'),
				catalogId: this.options.catalog.data.catalogId,
				catalogDisplayText: this.options.catalog.data.catalogDisplayText
			})
			this.showChildView('group', this.catalogGroup);
		},
		onBackToCatalog: function() {
			this.trigger('backToCatalog');
		}
	});
	return SingleCatalogView;
});