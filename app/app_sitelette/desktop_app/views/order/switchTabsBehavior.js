'use strict';

define([
	], function(template){
	var SwitchTabsBehavior = Mn.Behavior.extend({
		ui: {
			tab: '.tablinks',
			content: '.tabcontent'
		},
		events: {
			'click @ui.tab': 'onTabClicked'
		},

	    onTabClicked: function(e) {
	    	var $target = $(e.currentTarget),
	    		activate = $target.data('activate'),
	    		$tab = this.$('#' + activate);

	    	// if (this.view.tabActive === activate) return; //doesn't work because re-render
	    	this.view.tabActive = activate;
	    	this.ui.tab.removeClass('active');
	    	$target.addClass('active');
	    	this.ui.content.hide();
	    	$tab.show();

	    	if (typeof this.view.onTabShown === 'function') this.view.onTabShown();
	    }
	});
	return SwitchTabsBehavior;
});