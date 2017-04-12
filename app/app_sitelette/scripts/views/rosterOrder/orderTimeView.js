'use strict';

var Vent = require('../../Vent'),
    orderActions = require('../../actions/orderActions'),
    loader = require('../../loader'),
    popupController = require('../../controllers/popupController'),
    h = require('../../globalHelpers'),
    appCache = require('../../appCache'),
    moment = require('moment'),
    template = require('ejs!../../templates/rosterOrder/orderTime.ejs');

var OrderTimeView = Backbone.View.extend({

	name: 'order_time',

    id: 'cmtyx_order_time',

    moment: moment,

	initialize: function(options) {
		this.options = options || {};
        this.on('show', this.onShow, this);
        this.model.on('change', _.bind(this.reRender, this));
        this.render();

        this.deliveryDateInit();
	},

	render: function() {
		console.log(this.renderData());
        this.$el.html(template(this.renderData()));
        this.createCircles();
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    deliveryDateInit: function() {
        //deliveryPickupOptions
        this.orderDay = this.options.deliveryPickupOptions.options[0];
        this.orderTime = this.orderDay.hours[0];
        this.delivery = this.options.futureOrRegular === 'FUTURE' ? 'FUTURE' : 'REGULAR';
    },

    createCircles: function() {
        h().createCircles(this.$el.find('.circles_block'), this.options.circles, 2);
    },

    reRender: function() {
        var html = $.parseHTML(template(this.renderData())),
            tpl = $(html).html();

        this.$el.html(tpl);
    },

    onShow: function() {
        this.addEvents({
            'click .leftBtn': 'onRegularSelected',
            'click .rightBtn': 'onFutureSelected',
            'click .nav_next_btn': 'triggerNext',
            'click .nav_back_btn': 'goBack',
            'change #select-date': 'onSelectDate',
            'change #select-time': 'onSelectTime'
        });
        if (this.options.futureOrRegular === "FUTURE") {
            this.$('.leftBtn').addClass('disabled');
            this.$('.rightBtn').click();
        }
        else if (this.options.futureOrRegular === "REGULAR") {
            this.$('.rightBtn').addClass('disabled');
            this.$('.leftBtn').click();
        }

        this.$('.ui-select > div').addClass('cmtyx_border_color_1 cmtyx_text_color_1');
    },

    renderContent: function (){
        return this.$el;
    },

    renderData: function() {
        var number = this.model.get('creditCard').cardNumber;

    	return _.extend(this.model.toJSON(), {
            deliveryPickupOptions: this.options.deliveryPickupOptions,
    		futureOrRegular: this.options.futureOrRegular
        });
    },

    onRegularSelected: function() {
        this.$('.leftBtn').addClass('cmtyx_color_1');
        this.$('.leftBtn').removeClass('cmtyx_text_color_1');
        this.$('.rightBtn').removeClass('cmtyx_color_1');
        this.$('.rightBtn').addClass('cmtyx_text_color_1');
        this.delivery = 'REGULAR';
    },

    onFutureSelected: function() {
        this.$('.rightBtn').addClass('cmtyx_color_1');
        this.$('.rightBtn').removeClass('cmtyx_text_color_1');
        this.$('.leftBtn').removeClass('cmtyx_color_1');
        this.$('.leftBtn').addClass('cmtyx_text_color_1');
        this.delivery = 'FUTURE';
    },

    onSelectDate: function(e) {
        var $target = $(e.currentTarget),
            index = $target.get(0).options.selectedIndex,
            $time = this.$('#select-time'),
            date = this.options.deliveryPickupOptions.options[index],
            initial = date.hours[0].displayString,
            template = '';
        _.each(date.hours, function(hour){
            template += '<option value="' + hour.displayString + '">' + hour.displayString + '</option>';
        });
        $time.html(template);
        $time.val(initial);
        $time.selectmenu('refresh', true);
        this.orderDay = date;
    },
    onSelectTime: function(e) {
        var $target = $(e.currentTarget),
            index = $target.get(0).options.selectedIndex;

        this.orderTime = this.orderDay.hours[index];
    },
    getDeliveryDate: function() {
        if (this.delivery === 'REGULAR') return null;
        var deliveryDate = {
            date: this.orderDay.date,
            day: this.orderDay.day,
            time: this.orderTime
        };
        return deliveryDate;
    },
    setDeliveryDate: function() {
        var date = this.getDeliveryDate(),
            requestedDeliveryDate = date ? this.moment(date.date)
                                           .hour(date.time.hour)
                                           .minute(date.time.minute)
                                           .utc().format().replace('Z', ':UTC') : null;
        console.log(requestedDeliveryDate);
        this.model.set('requestedDeliveryDate', requestedDeliveryDate);
        this.model.additionalParams.deliveryDate = date;
    },
    triggerNext: function() {
        this.setDeliveryDate();
        Vent.trigger('viewChange', 'payment', {
                deliveryPickupOptions: this.options.deliveryPickupOptions,
                futureOrRegular: this.options.futureOrRegular,
                circles: this.options.circles,
                model: this.model,
                backTo: 'order_time'
            });
    },

    goBack : function() {
        //todo fix back to
        Vent.trigger('viewChange', this.options.backTo || 'address', {
            model: this.model,
            circles: this.options.circles
        });
    }
});

module.exports = OrderTimeView;
