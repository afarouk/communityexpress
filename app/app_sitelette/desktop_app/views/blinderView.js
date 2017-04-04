'use strict';

define([
	'ejs!../templates/blinder.ejs',
	], function(template){
	var BlinderView = Mn.View.extend({
		template: template,
		className: 'blinder-content',
		onRender: function() {
			
		}
	});
	return BlinderView;
});