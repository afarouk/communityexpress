'use strict';

define([
	'ejs!../../templates/order/orderTime.ejs',
	'./switchTabsBehavior',
	'moment'
	], function(template, SwitchTabsBehavior, moment){
	var OrderTimeView = Mn.View.extend({
		moment: moment,
		template: template,
		behaviors: [SwitchTabsBehavior],
		className: 'page order_time_page',
		ui: {
			back: '.nav_back_btn',
			next: '.nav_next_btn',
			date: '#select-date',
			time: '#select-time'
		},
		events: {
			'click @ui.back': 'onBack',
			'click @ui.next': 'onNext',
            'change @ui.date': 'onSelectDate',
            'change @ui.time': 'onSelectTime'
		},

		onRender: function() {
			if (this.futureOrRegular === "FUTURE") {
	            this.$('.left').addClass('disabled');
	            this.$('.left').attr('disabled', true);
	            this.$('.right').click();
	        } else if (this.futureOrRegular === "REGULAR") {
	            this.$('.right').addClass('disabled');
	            this.$('.right').attr('disabled', true);
	            this.$('.left').click();
	        }
		},

		serializeData: function() {
			this.deliveryPickupOptions = this.model.additionalParams.deliveryPickupOptions;
			var futureOrRegular = this.deliveryPickupOptions.futureOrRegular;
			if (futureOrRegular === "REGULAR" || futureOrRegular === "BOTH") {
				this.futureOrRegular = "REGULAR";
			} else if (futureOrRegular === "FUTURE") {
				this.futureOrRegular = "FUTURE";
			}

			this.deliveryDateInit();
			return _.extend(this.model.toJSON(), this.model.additionalParams, {
	            deliveryPickupOptions: this.deliveryPickupOptions,
	            futureOrRegular: this.futureOrRegular
	        });
		},

		deliveryDateInit: function() {
	        this.orderDay = this.deliveryPickupOptions.options[0];
	        this.orderTime = this.orderDay.hours[0];
	    },

		onSelectDate: function(e) {
	        var $target = $(e.currentTarget),
	            index = $target.get(0).options.selectedIndex,
	            $time = this.$('#select-time'),
	            date = this.deliveryPickupOptions.options[index],
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
	        if (this.futureOrRegular === 'REGULAR') return null;
	        var deliveryDate = {
	            date: this.orderDay.date,
	            day: this.orderDay.day,
	            time: this.orderTime
	        };
	        return deliveryDate;
	    },
	    setDeliveryDate: function() {
	        var date = this.getDeliveryDate(),
	            requestedDeliveryDate = date ? this.moment.utc(date.date.replace(':UTC', 'Z'))
	                                           .hour(date.time.hour)
	                                           .minute(date.time.minute)
	                                           .utc().format().replace('Z', ':UTC') : null;
	        console.log(requestedDeliveryDate);
	        this.model.set('requestedDeliveryDate', requestedDeliveryDate);
	        this.model.additionalParams.deliveryDate = date;
	    },

		onNext: function() {
			this.setDeliveryDate();
	    	this.trigger('onNextStep');
	    },

	    onBack: function() {
	    	this.trigger('onBackStep');
	    }
	});
	return OrderTimeView;
});