'use strict';

define([
	'ejs!../templates/catalogTab.ejs',
	], function(tabTemplate){

	var CatalogTabView = Mn.View.extend({
		template: tabTemplate,
		className: 'tablinks',
		tagName: 'button',
		triggers: {
			'click': 'select:group'
		},
		onRender: function() {
			var index = this.model.collection.indexOf(this.model);
			if (index === 0) {
				this.$el.addClass('active');
			}
		}
	});

	var CatalogsTabsView = Mn.CollectionView.extend({
		childView: CatalogTabView,
		className: 'tabs',
		initialize: function() {
			console.log(this.collection.toJSON());
		},
		onChildviewSelectGroup: function(childView) {
			this.children.each(function(view){
				if (childView === view) {
					view.$el.addClass('active');
				} else {
					view.$el.removeClass('active');
				}
			});
			this.trigger('group:selected', childView.model);
		}
	});

	return CatalogsTabsView;
});