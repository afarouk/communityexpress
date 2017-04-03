'use strict';

define([
	'ejs!../../templates/order/chooseAddress.ejs',
	'./switchTabsBehavior'
	], function(template, SwitchTabsBehavior){
	var ChooseAddressView = Mn.View.extend({
		template: template,
		behaviors: [SwitchTabsBehavior],
		className: 'page choose_address_page',
		ui: {
			radio: '[name="radio-choice-address"]',
			next: '.next_btn'
		},
		events: {
			'click @ui.next': 'onNext'
		},
		initialize: function() {
			console.log(this.model.additionalParams);
			console.log(this.model.toJSON());
			this.tabActive = this.model.additionalParams.allowDelivery ? 'delivery' : 'pick_up';
		},
		serializeData: function() {
			var favorites = this.model.additionalParams.userModel.favorites,
            	address = favorites.length !== 0 ? favorites.first().get('address') : this.getAddressFromSasl();
			return _.extend(this.model.toJSON(), this.model.additionalParams, {
				address: address
			});
		},

		getAddressFromSasl: function() {
	        var address = {
	            name: saslData.saslName,
	            street: saslData.street,
	            street2: saslData.street2,
	            number: saslData.number,
	            city: saslData.city,
	            state: saslData.state,
	            zip: saslData.zip,
	            phone: saslData.telephoneNumber
	        };
	        return address;
	    },

	    onNext: function() {
	    	this.trigger('onNextStep', this.tabActive);
	    }
	});
	return ChooseAddressView;
});