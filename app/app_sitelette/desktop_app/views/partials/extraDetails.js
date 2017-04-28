define([
	], function(){
	var ExtraDetailsBehavior = Mn.Behavior.extend({
		ui: {
			detailsImage: '[name="details-image"]'
		},
		events: {
			'click' : 'onExtraDetailsToggle'
		},

		onExtraDetailsToggle: function(e) {
			if ($(e.target).parents('#customizationContainer').length > 0) return;
			var urls = this.view.model.get('mediaURLs');
	    	if (!urls && !urls[0]) return;
	    	var src = this.ui.detailsImage.attr('src');
	    	if (src) {
	    		this.view.trigger('extra:details', this.view);
	    	} else {
	    		this.ui.detailsImage.on('load', function(){
	    			this.view.trigger('extra:details', this.view);
	    		}.bind(this));
	    		this.ui.detailsImage.attr('src', urls[0]);
	    	}
		}
	});

	return ExtraDetailsBehavior;
});