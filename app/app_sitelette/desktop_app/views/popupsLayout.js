'use strict';

define([
	'ejs!../templates/popupsLayout.ejs',
	], function(template){
	var PopupsLayoutView = Mn.View.extend({
		el: '#popups-layout',
		template: template,
		regions: {
			popupsContainer: '#popups-region'
		},
		initialize: function() {
			this.render();
		},
		render: function () {
			this.$el.html(this.template());
			return this;
     	}
	});
	return PopupsLayoutView;
});