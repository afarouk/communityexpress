'use strict';

define([
	'ejs!../templates/cartLayout.ejs',
	], function(template){
	var CartLayoutView = Mn.View.extend({
		el: '#cart-layout',
		template: template,
		regions: {
			cartContainer: '#cart-region'
		},
		initialize: function() {
			this.render();
		},
		render: function () {
			this.$el.html(this.template());
			return this;
     	}
	});
	return CartLayoutView;
});