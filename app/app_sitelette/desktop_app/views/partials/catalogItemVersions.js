define([
	'ejs!../../templates/partials/catalogItemVersions.ejs',
	], function(itemTemplate){
	var CatalogGroupItemView = Mn.View.extend({
		template: itemTemplate,
		className: 'catalog_item item_with_versions',
		tagName: 'li',
		ui: {
			selector: '.versions_selectors_container select',
			add: '.add_to_cart_btn'
		},
		events: {
			'click .add_to_cart_btn': 'onAddtoCart',
			'change @ui.selector': 'updateAddVersionButton',
		},
		initialize: function() {
			this.versions = [];
		},
		serializeData: function() {
			return _.extend(this.model.toJSON(), {
				selectorVersions: this.getSelectorVersions(),
            	availableVersion: this.getFirstAvailableVersion(),
			});
		},
		onRender: function() {
			this.updateAddVersionButton();
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
	            if(this.isAlreadyAdded(exists)) {
	                this.ui.add.attr('disabled', true);;
	            } else {
	                this.ui.add.attr('disabled', false);;
	                this.savedVersion = {
	                    version: new Backbone.Model(exists),
	                    selected: selectedValues,
	                    quantity: 1
	                };
	            }
	            // this.$('.order_price').text('$' + exists.price);
	        } else {
	            this.ui.add.attr('disabled', true);;
	        }
	    },

	    isAlreadyAdded: function(version) {
	        var exists = _.find(this.versions, function(item){
	            return item.version.get('itemId') === version.itemId &&
	                   item.version.get('itemVersion') === version.itemVersion;
	        });
	        return exists ? true : false;
	    },

	    onVersionAdded: function() {
	        this.versions.push(this.savedVersion);
	        this.addToBasket();
	        this.ui.add.attr('disabled', true);
	    },

	    getVersions: function() {
	        var versions = {
	            totalPrice: 0,
	            totalQuantity: 0,
	            selectedVersions: []
	        };
	        _.each(this.versions, function(version) {
	            var longVersion = _.extend(version, {
	                displayText: version.selected.join(' ,')
	            });
	            versions.selectedVersions.push(longVersion);
	            versions.totalPrice += longVersion.version.get('price') * longVersion.quantity;
	            versions.totalQuantity += longVersion.quantity;
	        });
	        return versions;
	    },

	    addToBasket: function (versionIndex, count) {
	        var index = versionIndex === undefined ? this.versions.length - 1 : versionIndex,
	            versions = this.getVersions(),
	            uuid = this.model.get('uuid'),
	            basketItem = this.versions[index].version;

	        basketItem.set('isVersion', true, {silent: true});
	        basketItem.set('itemName', this.model.get('itemName'), {silent: true});
	        basketItem.set('uuid', uuid + '_._' + basketItem.get('itemVersion'), {silent: true});
	        this.trigger('items:version:added', this.model, versions, basketItem);
	    },

	    onRemoveVersion: function(uuid) {
	    	var removed = this.versions.find(function(version){
		    		return uuid === version.version.get('uuid');
		    	}),
	    		index = this.versions.indexOf(removed);

	    	this.versions.splice(index, 1);
	        this.updateAddVersionButton();
	    },
	    onResetVersions: function() {
	    	this.versions = [];
	        this.updateAddVersionButton();
	    },
		onAddtoCart: function() {
			this.onVersionAdded();
		}
	});

	return CatalogGroupItemView;
});