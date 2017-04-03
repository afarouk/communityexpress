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
	    	this.view.tabActive = activate;
	    	this.ui.tab.removeClass('active');
	    	$target.addClass('active');
	    	this.ui.content.hide();
	    	$tab.show();
	    }
	});
	return SwitchTabsBehavior;
});