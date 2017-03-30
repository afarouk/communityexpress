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
			var card = new Skeuocard($("#skeuocard"));
		},
		render: function () {
			this.$el.html(this.template());
			return this;
     	}
	});
	return CartLayoutView;
});