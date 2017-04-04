'use strict';

define([
	'ejs!../templates/orderLayout.ejs',
	], function(template){
	var OrderLayoutView = Mn.View.extend({
		el: '#order-layout',
		template: template,
		regions: {
			orderContainer: '#order-region'
		},
		initialize: function() {
			this.render();
		},
		render: function () {
			this.$el.html(this.template());
			return this;
     	}
	});
	return OrderLayoutView;
});