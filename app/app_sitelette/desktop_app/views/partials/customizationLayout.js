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
		ui: {
			cancel: '[name="cancel"]',
			confirm: '[name="confirm"]'
		},
		events: {
			'click @ui.confirm': 'onConfirmCustomChoice'
		},
		triggers: {
			'click @ui.cancel': 'custom:cancel'
		},
		onRender: function() {
			this.showCustomization();
		},

		showCustomization: function() {
			var view = new CustomizationCollectionView(this.options);
			this.showChildView('customization', view);
			this.listenTo(view, 'selection:changed', this.onSelectionChanged.bind(this));
		},

		onSelectionChanged: function(allSelected) {
			if (allSelected) {
				this.allSelected = true;
			} else {
				this.allSelected = false;				
			}
		}

	});

	return CustomizationLayoutView;
});