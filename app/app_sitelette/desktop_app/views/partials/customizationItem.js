define([
	'ejs!../../templates/partials/customizationItem.ejs',
	], function(itemTemplate){
	var CustomizationItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'customization_item',
		tagName: 'li',
		ui: {
			input: 'input',
			checkbox: '[name="custom_checkbox"]'
		},
		events: {
			'click @ui.checkbox': 'onSelectionClicked',
			'change @ui.input': 'onSelectionChanged'
		},
		triggers: {
			
		},
		selected: 0,
		serializeData: function() {
			return _.extend(this.model.toJSON(), {
				price: this.options.itemModel.get('price')
			});
		},
		onSelectionClicked: function(e) {
			var $target = $(e.currentTarget),
				checked = $target.is(':checked');
			if (checked && this.selected >= this.model.get('maxSubSubCount')) {
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
				this.selected ++;
			} else {
				this.selected --;
			}
			console.log('custom subsubitem: ', val, checked);
		}
	});

	return CustomizationItemView;
});