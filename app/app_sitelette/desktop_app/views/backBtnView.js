'use strict';

define([
	'ejs!../templates/backBtn.ejs',
	], function(template){
	var BackBtnView = Mn.View.extend({
		el: '#back-btn-container',
		ui: {
			'back_btn': '.back-btn-inner-wrapper'
		},
		events: {
			'click @ui.back_btn' : 'goPrevPage'
		},
		initialize: function() {
			this.template = template;
			this.render();
		},
		render: function () {
			if( document.referrer ) {
				this.$el.parent().addClass('with-back-btn');
			}
			this.$el.html(this.template());
			return this;
     	},
     	goPrevPage: function() {
     		window.history.back();
     	}
	});
	return BackBtnView;
});