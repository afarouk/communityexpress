define([
	'ejs!../../templates/partials/catalogItemVersions.ejs',
	'./extraDetails'
	], function(itemTemplate, extraDetailsBehavior){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item item_with_versions',
		tagName: 'li',
		behaviors: [extraDetailsBehavior],
		regions: {
			customization: '#customizationContainer'
		},
		ui: {
			customize: '[name="item_customize"]',
			customMark: '[name="customization-mark"]',
			selector: '.versions_selectors_container select',
			add: '[name="add_to_cart_btn"]',
			details: '[name="extra-details"]'
		},
		events: {
			'click @ui.customize': 'onCustomize',
			'click .add_to_cart_btn': 'onAddtoCart',
			'change @ui.selector': 'updateAddVersionButton',
			'click @ui.selector': 'stopPropagation'
		},
		triggers: {
			'click @ui.customize': 'items:customized'
		},
		serializeData: function() {
			return _.extend(this.model.toJSON(), {
				selectorVersions: this.getSelectorVersions(),
            	availableVersion: this.getFirstAvailableVersion(),
			});
		},
		onRender: function() {
			this.updateAddVersionButton();

			if (this.model.get('typeInGroup').enumText === 'OUTOFSTOCK') {
	            this.$el.addClass('out-of-stock');
	        }
		},

		onCustomize: function(e) {
			var $el = this.getRegion('customization').$el;
			this.ui.customMark.removeClass('visible');
			if ($el.is(':visible')) {
				$el.slideToggle('slow');
				this.ui.customize.removeClass('opened');
			} else {
				this.dispatcher.get('customize')
					.triggerMethod('customizeItem', this, this.savedVersion.subItems);
			}

			e.stopPropagation();
		},
		getSelectorVersions: function() {
	        var selectorOptions = this.model.get('selectorOptions'),
	            length = Object.keys(selectorOptions).length,
	            versions = [];
	        _.each(selectorOptions, function(version){
	            if (version.second && version.second.length > 0) {
	                versions.push(version.second);
	            }
	        });
	        return versions;
	    },
	    getFirstAvailableVersion: function() {
	        var version = this.model.get('itemVersions')[0],
	            available = [],
	            text1 = version.version1DisplayText,
	            text2 = version.version2DisplayText,
	            text3 = version.version3DisplayText;
	        if (text1) available.push(text1);
	        if (text2) available.push(text2);
	        if (text3) available.push(text3);
	        return available;
	    },
	    onUpdateItemPrice:  function(selectedItems) {
	    	var adjustedPrice = 0;
	    	_.each(selectedItems, function(item){
	    		adjustedPrice += _.reduce(_.pluck(item.selected, 'priceAdjustment'), function(a, b) {return a+b;});
	    	});
	    	this.$('.version_order_price').text('$' + ( this.savedVersion.price + adjustedPrice ));
	    },
	    updateAddVersionButton: function() {
	        var itemVersions = this.model.get('itemVersions'),
	            $selected = this.ui.selector.find(':selected'),
	            search = {},
	            exists,
	            selectedValues = [];
	        $selected.each(function(){
	            selectedValues.push(this.value);
	        });
	        for (var i = 1; i <= selectedValues.length; i++) {
	            search['version' + i + 'DisplayText'] = selectedValues[i - 1];
	        }
	        exists = _.findWhere(itemVersions, search);
	        if (exists) {
	            this.savedVersion = exists;
	            this.ui.add.attr('disabled', false);
	            this.$('.item_version_not_available').removeClass('visible');
	            this.$('.version_order_price').text('$' + exists.price);
	        } else {
	            this.ui.add.attr('disabled', true);
	            this.$('.item_version_not_available').addClass('visible');
	        }

	        //reset customization if version selected
	        var $el = this.getRegion('customization').$el;
			this.ui.customMark.removeClass('visible');
			if ($el.is(':visible')) {
				this.ui.add.attr('disabled', true);
				this.ui.customize.attr('disabled', true);
				$el.slideToggle('slow', function(){
					this.ui.add.attr('disabled', false);
					this.ui.customize.attr('disabled', false);
				}.bind(this));
				this.ui.customize.removeClass('opened');
			} 
	    },

	    onAddtoCart: function (e) {
	        var uuid = this.model.get('uuid'),
	            basketItem = new Backbone.Model(this.savedVersion);

	        basketItem.set('isVersion', true, {silent: true});
	        basketItem.set('itemName', this.model.get('itemName'), {silent: true});
	        basketItem.set('uuid', uuid + '_._' + basketItem.get('itemVersion'), {silent: true});
	        this.trigger('items:version:added', this, basketItem);

			e.stopPropagation();
	    },

	    stopPropagation: function(e) {
			e.stopPropagation();
	    }
	});

	return CatalogGroupItemView;
});