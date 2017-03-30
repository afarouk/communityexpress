'use strict';

define([
	'ejs!../templates/orderLayout.ejs',
	], function(template){
	var OrderLayoutView = Mn.View.extend({
		el: '#order-layout',
		template: template,
		regions: {
			cartContainer: '#order-region'
		},
		initialize: function() {
			this.render();
			var card = new Skeuocard($("#skeuocard"));
		},
		render: function () {
			this.$el.html(this.template());
			return this;
     	}
	});
	return OrderLayoutView;
});