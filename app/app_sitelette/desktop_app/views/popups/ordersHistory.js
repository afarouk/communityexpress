'use strict';

define([
	'ejs!../../templates/popups/ordersHistory.ejs',
	'ejs!../../templates/popups/orderDetails.ejs',
	'moment'
	], function(ordersHistoryTpl, orderDetailsTpl, moment){
	var OrdersHistoryView = Mn.View.extend({
		moment: moment,
		state: 'ORDERS_HISTORY',
		getTemplate: function() {
			if (this.state === 'ORDERS_HISTORY') {
				return ordersHistoryTpl;
			} else if (this.state === 'ORDER_DETAILS') {
				return orderDetailsTpl;
			}
		},

		className: 'orders-history-popup',
		ui: {
			order: '[name="order-row"]',
			back: '[name="order-back"]'
		},
		events: {
			'click @ui.order': 'onOrderDetails',
			'click @ui.back': 'onOrderBack'
		},
		initialize: function(options) {
			this.options = options;
		},
		serializeData: function(a) {
			var ordersHistory = this.options.history;
			if (this.state === 'ORDERS_HISTORY') {
				return {
	        		ordersHistory: ordersHistory.map(function(order) {
			            var date = order.dateTimeOrderPlacedOn.replace('at', '');
			            return {
			                orderUUID: order.orderUUID,
			                orderId: order.orderId,
			                totalAmount: order.totalAmount,
			                saslName: order.saslName,
			                dateTimeOrderPlacedOn: this.moment(date).format('MMM D \'YY')
			            };
			        }.bind(this))
				};
			} else if (this.state === 'ORDER_DETAILS') {
				return {
					orderDetailsSrc: this.orderDetailsSrc
				};
			}
	    },
     	onShow: function () {
     		this.$el.dialog('open');
     		this.$el.prev().find('.ui-dialog-title').hide();
     		$('.cmtyx_desktop_application').addClass('with-blur');
     		this.$el.prev().find('.ui-dialog-titlebar-close').click(function() {
				$('.cmtyx_desktop_application').removeClass('with-blur');
			});
			this.$el.parent().width('440px');
     	},
     	onClose: function() {
     		this.$el.dialog('close');
     		$('.cmtyx_desktop_application').removeClass('with-blur');
     	},

     	onOrderDetails: function(e) {
     		var $target = $(e.currentTarget),
            orderUUID = $target.data('uuid');
            this.dispatcher.get('history').getOrderDetails(orderUUID)
            	.then(function(html){
            		this.state = 'ORDER_DETAILS';
            		this.orderDetailsSrc = 'data:text/html;charset=utf-8,' + escape(html);
            		this.render();
            	}.bind(this));
     	},

     	onOrderBack: function() {
     		this.state = 'ORDERS_HISTORY';
     		this.render();
     	}
	});
	return OrdersHistoryView;
});