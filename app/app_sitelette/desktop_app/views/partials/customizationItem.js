define([
	'ejs!../../templates/partials/customizationItem.ejs',
	], function(itemTemplate){
	var CustomizationItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'customization_item',
		tagName: 'li',
		ui: {
			input: 'input',
			checkbox: 'input[type="checkbox"]'
		},
		events: {
			'change @ui.input': 'onSelectionChanged'
		},
		triggers: {
			
		},
		initialize: function() {
			var byDefault = _.where(this.model.get('subSubItems'), {isSelectedByDefault: true});
			this.selectedNumber = byDefault.length; //get selected by default number
		},
		serializeData: function() {
			return _.extend(this.model.toJSON(), {
				price: this.options.itemModel.get('price')
			});
		},
		onRender: function() {
			this.checkConfirmed();
		},
		checkConfirmed: function() {
			if (this.selectedNumber === this.model.get('maxSubSubCount')) {
				var $notChecked = this.$el.find('input:checkbox:not(:checked)');
				$notChecked.parents('.subItem').addClass('disabled');
			} else {
				this.$el.find('.subItem.disabled').removeClass('disabled');
			}
			if (this.selectedNumber >= this.model.get('minSubSubCount')) {
				this.$el.addClass('confirmed');
				this.selected = true;
			} else {
				this.$el.removeClass('confirmed');
				this.selected = false;
			}
			this.saveSelectedItems();
			this.trigger('selection:changed');
		},
		saveSelectedItems: function() {
			var selectedItems = [],
				subitemData,
				$checked = this.$el.find('input:checked');
			$checked.each(function(index, subitem) {
				var $subitem = $(subitem),
					ssItemId = parseInt($subitem.val()),
					ssItem = _.findWhere(this.model.get('subSubItems'), {subSubItemId: ssItemId});
					selectedItems.push(ssItem);
			}.bind(this));
			subitemData = {
				displayText: this.model.get('displayText'),
				selected: selectedItems
			};
			if (selectedItems.length > 0) {
				this.options.selectedItems[this.model.get('subItemId')] = subitemData;
			} else {
				delete this.options.selectedItems[this.model.get('subItemId')];
			}
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