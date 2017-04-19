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
			'click @ui.input': 'onSelectionClicked',
			'change @ui.input': 'onSelectionChanged'
		},
		triggers: {
			
		},
		initialize: function() {
			this.selected = this.options.selected;
		},
		onSelectionClicked: function(e) {
			var $target = $(e.currentTarget),
				checked = $target.is(':checked');
			if (checked && this.selected.quantity >= this.model.get('maxSubSubCount')) {
				//todo you can't select more then max warning
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else {

			}
		},
		onSelectionChanged: function(e) {
			var $target = $(e.currentTarget),
				val = $target.val(),
				checked = $target.is(':checked');
			if (checked) {
				this.selected.quantity ++;
			} else {
				this.selected.quantity --;
			}
			console.log('custom subsubitem: ', val, checked);
		}
	});

	return CustomizationItemView;
});