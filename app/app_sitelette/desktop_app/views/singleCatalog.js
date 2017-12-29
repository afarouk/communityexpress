'use strict';

define([
	'ejs!../templates/singleCatalog.ejs',
	'./catalogTabs',
	'./partials/catalogGroup',
	'moment'
	], function(template, CatalogTabsView, CatalogGroupView, moment){
	var SingleCatalogView = Mn.View.extend({
		moment: moment,
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
			this.groups = this.getValidGroups();
			return {
				catalogId: this.options.catalogId,
				filled: this.groups.length ? true : false
			};
		},
		getValidGroups: function() {
			//filter groups by isValidSomeTimeOnly
			var groups = this.options.catalog.collection.groups,
				filtered = _.filter(groups, function(group){
					if (!group.isValidSomeTimeOnly) {
						return group;
					} else {
						var validity = group.groupValidityTimeSlots, //hasValidTime
							startTime = (this.moment()).hour(validity.timeSlot.hour).minute(validity.timeSlot.minute),
							endTime = (this.moment()).hour(validity.timeSlot.endHour).minute(validity.timeSlot.endMinute),
							isBetween = this.moment().isBetween(startTime, endTime);
						if (isBetween) return group;
					}
				}.bind(this));
			return filtered;
		},
		onRender: function() {
			var groups = new Backbone.Collection(this.groups);
			if (!groups.length) return;
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