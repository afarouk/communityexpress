define([
	'ejs!../../templates/partials/customizationItem.ejs',
	], function(itemTemplate){
	var CustomizationItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'customization_item',
		tagName: 'li',
		ui: {
			input: 'input'
		},
		events: {
			'change @ui.input': 'onSelectionChanged'
		},
		triggers: {
			
		},
		onSelectionChanged: function(e) {
			var $target = $(e.currentTarget),
				val = $target.val(),
				checked = $target.is(':checked');
			console.log('custom subsubitem: ', val, checked);
		}
	});

	return CustomizationItemView;
});