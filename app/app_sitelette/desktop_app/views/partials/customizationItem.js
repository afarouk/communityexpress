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
		initialize: function() {
			var byDefault = _.where(this.model.get('subSubItems'), {isSelectedByDefault: true});
			this.selectedNumber = byDefault.length; //get selected by default number
			this.checkConfirmed();

		},
		serializeData: function() {
			return _.extend(this.model.toJSON(), {
				price: this.options.itemModel.get('price')
			});
		},
		onSelectionClicked: function(e) {
			var $target = $(e.currentTarget),
				checked = $target.is(':checked');
			if (checked && this.selectedNumber >= this.model.get('maxSubSubCount')) {
				//todo you can't select more then max warning
				e.preventDefault();
				e.stopPropagation();
				return false;
			} else {

			}
		},
		checkConfirmed: function() {
			if (this.selectedNumber === this.model.get('maxSubSubCount')) {
				var $checked = this.$el.find('input:checkbox:not(:checked)');
				$checked.parents('.subItem').addClass('disabled');
				this.$el.addClass('confirmed');
				this.selected = true;
			} else {
				this.$el.find('.subItem.disabled').removeClass('disabled');
				this.$el.removeClass('confirmed');
				this.selected = false;
			}
			this.trigger('selection:changed');
		},
		onSelectionChanged: function(e) {
			var $target = $(e.currentTarget),
				val = $target.val(),
				checked = $target.is(':checked');
			if ($target.attr('type') === 'radio') {
				this.selectedNumber = 1;
			} else {
				if (checked) {
					this.selectedNumber ++;
				} else {
					this.selectedNumber --;
				}
			}
			this.checkConfirmed();
			console.log('custom subsubitem: ', val, checked);
		}
	});

	return CustomizationItemView;
});