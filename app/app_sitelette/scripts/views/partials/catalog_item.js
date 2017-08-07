/*global define*/

'use strict';

var regularTemplate = require('ejs!../../templates/partials/catalog-item.ejs'),
    versionsTemplate = require('ejs!../../templates/partials/catalog-versions-item.ejs'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache'),
    Vent = require('../../Vent');

var CatalogItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'cmntyex-catalog-item sides_extras_container color1',

    events: {
        'click': 'onClick',
        'click .catalog_item_counter': 'preventClick',
        'click .plus_button': 'incrementQuantity',
        'click .minus_button': 'decrementQuantity',
        'click .item_name': 'openItemDetails',
        'click .versions_buttons': 'preventClick',
        'change .versions_buttons select': 'updateAddVersionButton',
        'click .plus_version_button': 'onVersionAdded',
        'click [name="item_customize"]': 'onCustomize',
        'click [name="customization-reset"]': 'onCustomizationReset'
    },

    initialize: function (options) {
        this.quantity = 0;
        this.onClick = function () {
            options.onClick(this);
        }.bind(this);
        this.index = options.index;
        this.color = options.color;
        this.basket = options.basket;
        this.updateQuantity();
        this.catalogId = options.catalogId;
        this.groupId = options.groupId;
        this.groupDisplayText=options.groupDisplayText;
        this.catalogDisplayText=options.catalogDisplayText;
        this.withExpandedDetails = false;
        this.preopenAllPictures = options.preopenAllPictures;
        this.direction = options.direction;
        if (this.preopenAllPictures) {
            this.withExpandedDetails = true;
        }

        this.listenTo(this.basket, 'reset change add remove', this.updateQuantity, this);

        //backup price
        this.model.set('originalPrice', this.model.get('price'));
        this.model.set('originalSubItems', this.model.get('subItems'));
    },

    render: function() {
        var hasVersion = this.model.get('hasVersions'),
            template = hasVersion ? versionsTemplate : regularTemplate;
        this.$el.html(template(_.extend({}, this.model.attributes, {
            color: this.color,
            quantity: this.quantity || 0,
            selectorVersions: hasVersion ? this.getSelectorVersions() : null,
            availableVersion: hasVersion ? this.getFirstAvailableVersion() : null,
            preopenAllPictures: this.preopenAllPictures,
            direction: this.direction
        })));
        if (hasVersion) {
            this.updateAddVersionButton();
            this.$el.find('.sides_extras_item_details').css('width','100%');
        }
        this.listenLoadImage();
        if (this.preopenAllPictures) {
            this.checkImageURL();
        }

        this.$el.addClass(this.generateColor());
        this.$el.find('.item_name').addClass(this.generateTextColor());
        this.$el.find('.order_price').addClass(this.generateTextColor());

        return this;
    },

    generateColor: function(index) {
        var colors = [ 'cmtyx_color_2', 'cmtyx_color_4' ],
            index = this.index - 1;
        return colors[index % colors.length];
    },

    generateTextColor: function(index) {
        var colors = [ 'cmtyx_text_color_2', 'cmtyx_text_color_4' ],
            index = this.index - 1;
        return colors[index % colors.length];
    },

    // for horizontal carousel
    listenLoadImage: function() {
        if (this.direction !== 'HORIZONTAL') return;
        var container = this.$el.find('.sides_extras_detailed_image');
        var img = container.find('img');
        img.on('load', function(e){
            var image = e.target,
                ratio = image.naturalWidth / image.naturalHeight;
            this.ratio = ratio;
            setTimeout(function(){
                var containerHeight = container.height();
                container.width(containerHeight * ratio + 'px');
            }, 10);
        }.bind(this));
    },

    adjustImageContainer: function() {
        if (this.direction !== 'HORIZONTAL') return;
        var container = this.$el.find('.sides_extras_detailed_image'),
            containerHeight = container.height();
        container.width(containerHeight * this.ratio + 'px');
        //use adjustCallback from group view if we will have version with horizontal direction
    },
    //....................

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

    onClick: function() {
        this.onClick();
    },

    preventClick: function() {
        return false;
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

    updateAddVersionButton: function() {
        var itemVersions = this.model.get('itemVersions'),
            $selectors = this.$('.versions_buttons select'),
            $selected = $selectors.find(':selected'),
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
            this.$('.sides_extras_item_not_available_versions').removeClass('visible');
            this.$('.plus_version_button').removeClass('disabled');
            this.savedVersion = {
                version: new Backbone.Model(exists),
                selected: selectedValues,
                quantity: 1
            };
            this.savedVersion.version.set('originalPrice', exists.price);
            this.$('.order_price').text('$' + exists.price);
        } else {
            this.$('.plus_version_button').addClass('disabled');
            this.$('.sides_extras_item_not_available_versions').addClass('visible');
            this.$('.order_price').html('<br>');
        }
        this.$('.customization-mark').removeClass('visible');
        this.$('.customization-reset').removeClass('visible');
    },

    getVersions: function() {
        var versions = {
            totalPrice: 0,
            totalQuantity: 0,
            selectedVersions: []
        };
        _.each([this.savedVersion], function(version) {
            var longVersion = _.extend(version, {
                displayText: version.selected.join(' ,')
            });
            versions.selectedVersions.push(longVersion);
            versions.totalPrice += longVersion.version.get('price') * longVersion.quantity;
            versions.totalQuantity += longVersion.quantity;
        });
        return versions;
    },
    onVersionAdded: function (versionIndex, count) {
        var versions = this.getVersions(),
            uuid = this.model.get('uuid'),
            basketItem = this.savedVersion.version;

        h().playSound('addToCart');
        this.basket.setBasketVersions(this.model, versions);
        if (!basketItem) return;
        basketItem.set('isVersion', true, {silent: true});
        basketItem.set('itemName', this.model.get('itemName'), {silent: true});
        basketItem.set('uuid', uuid + '_' + basketItem.get('itemVersion'), {silent: true});
        this.basket.addItem(basketItem, count || 1,this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    },

    expandDetails: function() {
        this.checkImageURL(function(){
            this.$('.sides_extras_detailed').slideDown();
            this.withExpandedDetails = true;
        }.bind(this));
    },

    checkImageURL: function(callback) {
        var $img = $(this.el).find('.sides_extras_detailed_image img'),
            urls = this.model.get('mediaURLs'),
            src = urls ? urls[0] : '';

        if ($img.length && !$img.attr('src')) {
            $img.on('load', function(){
                if (typeof callback === 'function') callback();
            }.bind(this));
            $img.attr('src', src);
        } else {
            if (typeof callback === 'function') callback();
        }
    },

    collapseDetails: function() {
        this.$('.sides_extras_detailed').slideUp();
        this.withExpandedDetails = false;
    },

    incrementQuantity: function () {

        h().playSound('addToCart');

        this.addItem = true;
        this.quantity = this.quantity + 1;
        this.addToBasket();
        return false;
    },

    decrementQuantity: function () {
        this.addItem = false;
        var qty = this.quantity;

        if (qty === 0) return false;

        h().playSound('removeFromCart');

        this.quantity = this.quantity - 1;
        this.addToBasket();
        return false;
    },

    updateQuantity: function () {
        if (this.basket.length === 0) {
            this.$('.quantity').text(0);
            this.quantity = 0;
        } else {
            var modelChanged = this.basket.getItem(this.model);
            if (modelChanged) {
                this.quantity = modelChanged.get('quantity');
                this.$('.order_price').text('$' + (this.model.get('price') * (this.quantity === 0 ? 1 : this.quantity)).toFixed(2));
            } else {
                this.quantity = 0;
                if (!this.model.get('hasVersions')) {
                    this.$('.order_price').text('$' + this.model.get('price'));
                }
            }
        }
        this.model.set('quantity', this.quantity);
        this.$('.quantity').text(this.quantity);
    },

    addToBasket: function () {
    	var count;
        this.addItem ? count = 1 : count = -1;
        console.log(this.model.toJSON());
        this.model.set('quantity', this.model.get('quantity') + count);
        this.basket.addItem(this.model, count, this.groupId,this.groupDisplayText,this.catalogId,this.catalogDisplayText);
    },

    onCustomize: function(e) {
        e.preventDefault();
        e.stopPropagation();
        Vent.trigger( 'viewChange', 'customization', {
            model: this.model,
            catalogId: this.catalogId,
            catalogDisplayText: this.catalogDisplayText,
            savedVersion: this.savedVersion,
            showCustomizationMark: this.showCustomizationMark.bind(this)
        });
        return false;
    },

    showCustomizationMark: function() {
        this.$('.customization-mark').addClass('visible');
        this.$('.customization-reset').addClass('visible');
        if (this.model.get('hasVersions')) {
            var adjustedPrice = this.savedVersion.version.get('price');
            this.$('.order_price').text('$' + adjustedPrice);
        } else {
            this.updateQuantity(this.model);
        }
    },
    onCustomizationReset: function(){
        if (this.model.get('hasVersion')) {
            this.updateAddVersionButton();
        } else {
            this.$('.customization-mark').removeClass('visible');
            this.$('.customization-reset').removeClass('visible');
            this.model.set('price', this.model.get('originalPrice'));
            this.model.set('subItems', this.model.get('originalSubItems'));
            this.model.unset('customizationNote');
            this.updateQuantity();
            console.log(this.model.toJSON());
        }
    }
});

module.exports = CatalogItemView;
