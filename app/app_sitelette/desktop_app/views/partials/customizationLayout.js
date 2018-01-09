define([
	'ejs!../../templates/partials/customizationLayout.ejs',
	'./customizationCollectionView'
	], function(itemTemplate, CustomizationCollectionView){
	var CustomizationLayoutView = Mn.View.extend({
		template: itemTemplate,
		className: 'customization_layout',
		regions: {
			customization: '#customization-region'
		},

		onRender: function() {
			this.showCustomization();
		},

		showCustomization: function() {
			var view = new CustomizationCollectionView(this.options);
			this.showChildView('customization', view);
			this.listenTo(view, 'selection:changed', this.onSelectionChanged.bind(this));
		},

		onSelectionChanged: function(allSelected, selectedItems) {
			if (allSelected) {
				this.allSelected = true;
			} else {
				this.allSelected = false;				
			}
			this.trigger('selection:changed', allSelected, selectedItems);
		}

	});

	return CustomizationLayoutView;
});