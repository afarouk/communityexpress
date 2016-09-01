/*
function getObjectSize(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
};

function parseHashBangArgs(aURL) {
	aURL = aURL || window.location.href;

	var vars = {};
	var hashes = aURL.slice(aURL.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		var hash = hashes[i].split('=');
		if (hash.length > 1) {
			vars[hash[0]] = hash[1];
		} else {
			;// vars[hash[0]] = null;
		}
	}
	return vars;
}
*/
var mobile_apiurl;
var email_apiurl;


function showResults(success, message) {
	$('#demosite_message').text(message);
	$('#demosite_form_row').hide();
	$('#demosite_result_row').fadeIn('slow');
}

function hideResults(success, message) {
	$('#demosite_form_row').show();
	$('#demosite_result_row').hide();
}

function showError(success, message) {
	$('#demosite_error_message').text(message);
	$('#demosite_form_row').hide();
	$('#demosite_error_row').fadeIn('slow');

}

function submitMobileRequest() {
	$.ajax({
		url : mobile_apiurl,
		type : 'POST'
	}).done(function(response) {
		console.log("response :" + response);
		/* TODO show success */
		/*
		 * call function to show message
		 */
		var message = "Your message has been sent";
		var success = true;
		showResults(success, message);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		var message = processAjaxError(jqXHR);
		var success = false;
		showError(success, message);
		/*
		 *
		 */
	}).always(function() {
		ladda_submit_mobile_button.stop();
	});
}

function submitEmailRequest() {
	$.ajax({
		url : email_apiurl,
		type : 'POST'
	}).done(function(response) {
		console.log("response :" + response);
		/* TODO show success */
		/*
		 * call function to show message
		 */
		var message = "Your message has been sent";
		var success = true;
		showResults(success, message);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		var message = processAjaxError(jqXHR);
		var success = false;
		/*
		 * call function to show message
		 */
		showError(success, message);
		/*
		 *
		 */
	}).always(function() {
		ladda_submit_email_button.stop();
	});
}

function attachBootstrapValidatorsToSendMobileForm($demositeMobileForm,
		$submitButton) {
	/*
	 * attach to bootstrapvalidator events
	 */

	// IMPORTANT: You must declare .on('init.field.fv')
	// before calling .formValidation(options)
	$demositeMobileForm
			.on(
					'init.field.fv',
					function(e, data) {
						$submitButton.prop('disabled', true);
						// data.fv --> The FormValidation instance
						// data.field --> The field name
						// data.element --> The field element
						var $icon = data.element.data('fv.icon'), options = data.fv
								.getOptions(), // Entire
						// options
						validators = data.fv.getOptions(data.field).validators; // The
																				// field
						// validators
						if (validators.notEmpty && options.icon
								&& options.icon.required) {
							// The field uses notEmpty validator
							// Add required icon
							$icon.addClass(options.icon.required).show();
						}
					})
			.formValidation(
					{
						framework : 'bootstrap',
						icon : {
							required : 'glyphicon glyphicon-asterisk',
							valid : 'glyphicon glyphicon-ok',
							invalid : 'glyphicon glyphicon-remove',
							validating : 'glyphicon glyphicon-refresh'
						},
						button : {
							selector : '#submit_mobile',
						},
						fields : {
							share_mobile : {
								trigger : 'keyup change blur',
								message : 'A valid US mobile number is required',
								validators : {
									notEmpty : {
										message : 'A valid US mobile number is required'
									},
									phone : {
										country : 'US',
										message : 'The value is not valid US phone number'
									}
								}
							},
							certify_mobile : {
								trigger : 'keyup change',
								validators : {
									notEmpty : {
										message : 'Please certify that the recipient has agreed.'
									},
								},
								onSuccess : function(e, data) {

								},
								onError : function(e, data) {

								}
							}
						}
					// end fields
					})
			.on('status.field.fv', function(e, data) {

			})
			.on('err.field.fv', function(e, data) {

				data.fv.disableSubmitButtons(true);
				/*
				 * field has changed, so remove previous error
				 */
				// hideEmailRegistrationError();
			})
			.on('success.field.fv', function(e, data) {

				// Check if there is at least one field which is not validated
				// yet
				// or being validated
				if (data.fv.isValid() === null) {
					data.fv.disableSubmitButtons(true);
				} else {
					data.fv.disableSubmitButtons(false);
				}

				/*
				 * field has changed, so remove previous error
				 */
				// hideEmailRegistrationError();
			})
			.on(
					'success.form.fv',
					function(e, data) {

						// Prevent form submission
						e.preventDefault();

						ladda_submit_mobile_button.start();
						/*
						 * get the mobile number from form
						 */
						var $form = $(e.target); // The form instance
						communityRequestProfile.mobile = $form.find(
								'input[name="share_mobile"]').val();

						mobile_apiurl = communityRequestProfile.protocol
								+ communityRequestProfile.api_server
								+ '/apptsvc/rest/html/sendAppURLForUrlKeyToMobileviaSMS?friendlyURL='
								+ communityRequestProfile.friendlyURL
								+ '&toTelephoneNumber='
								+ communityRequestProfile.mobile;
						submitMobileRequest();

						/*
						 *
						 */
					}).on('err.form.fv', function(e, data) {

			});
}

function attachBootstrapValidatorsToSendEmailForm($demositeEmailForm,
		$submitButton) {
	/*
	 * attach to bootstrapvalidator events
	 */

	// IMPORTANT: You must declare .on('init.field.fv')
	// before calling .formValidation(options)
	$demositeEmailForm
			.on(
					'init.field.fv',
					function(e, data) {
						$submitButton.prop('disabled', true);
						// data.fv --> The FormValidation instance
						// data.field --> The field name
						// data.element --> The field element
						var $icon = data.element.data('fv.icon'), options = data.fv
								.getOptions(), // Entire
						// options
						validators = data.fv.getOptions(data.field).validators; // The
																				// field
						// validators
						if (validators.notEmpty && options.icon
								&& options.icon.required) {
							// The field uses notEmpty validator
							// Add required icon
							$icon.addClass(options.icon.required).show();
						}
					})
			.formValidation(
					{
						framework : 'bootstrap',
						icon : {
							required : 'glyphicon glyphicon-asterisk',
							valid : 'glyphicon glyphicon-ok',
							invalid : 'glyphicon glyphicon-remove',
							validating : 'glyphicon glyphicon-refresh'
						},

						button : {
							selector : '#submit_email',
						},
						fields : {
							share_email : {
								trigger : 'keyup change blur',
								message : 'A valid email is required',
								validators : {
									notEmpty : {
										message : 'A valid email is required'
									},

									emailAddress : {
										message : 'The value is not a valid email address'
									}
								}
							},
							certify_email : {
								trigger : 'keyup change',
								validators : {
									notEmpty : {
										message : 'Please certify that the recipient has agreed.'
									},
								},
								onSuccess : function(e, data) {

								},
								onError : function(e, data) {

								}
							}
						}
					// end fields
					})
			.on('status.field.fv', function(e, data) {

			})
			.on('err.field.fv', function(e, data) {

				data.fv.disableSubmitButtons(true);
				/*
				 * field has changed, so remove previous error
				 */
				// hideEmailRegistrationError();
			})
			.on('success.field.fv', function(e, data) {

				// Check if there is at least one field which is not validated
				// yet
				// or being validated
				/*
				if (data.fv.isValid() === null) {
					data.fv.disableSubmitButtons(true);
				} else {
					data.fv.disableSubmitButtons(false);
				}
				*/

				/*
				 * field has changed, so remove previous error
				 */
				// hideEmailRegistrationError();
			})
			.on(
					'success.form.fv',
					function(e, data) {

						// Prevent form submission
						e.preventDefault();

						ladda_submit_email_button.start();

						var $form = $(e.target); // The form instance
						communityRequestProfile.email = $form.find(
								'input[name="share_email"]').val();

						email_apiurl = communityRequestProfile.protocol
								+ communityRequestProfile.api_server
								+ '/apptsvc/rest/html/sendAppURLForUrlKeyToEmail?friendlyURL='
								+ communityRequestProfile.friendlyURL + '&toEmail='
								+ communityRequestProfile.email  ;

						// Prevent form submission
						e.preventDefault();
						// var $form = $(e.target); // The form
						// instance
						// newpassword =
						// $form.find('input[name="password"]').val();
						// submit Form To API
						submitEmailRequest();

						/*
						 *
						 */
					}).on('err.form.fv', function(e, data) {

			});
}
$(document).ready(
		function() {

			urlparams = parseHashBangArgs();
			console.log(urlparams);
			var newsrc;
			// if(getObjectSize(urlparams)===1)
			if (jQuery.isEmptyObject(urlparams))
				newsrc = window.location.href + "?desktopiframe=true";
			else
				newsrc = window.location.href + "&desktopiframe=true";

			document.getElementById('communityexpress').src = newsrc;

			 /*
			    * this parses the URL and sets up the global variables object
			    *
			    * communityRequestProfile.
			    *
			    * Globals are ugly, but ok for now
			    */
			   parseCommunityURL();

			/*
			    * setup ladda progress indicator
			    */

			   ladda_submit_mobile_button = Ladda.create(document
			     .querySelector('#submit_mobile'));
			   ladda_submit_email_button = Ladda.create(document
			     .querySelector('#submit_email'));
			/*
			 * set up the form handlers.
			 */

			/*
			 * ---------- mobile form --------------
			 */
			var mobileForm = $('#demosite_mobile_form');
			var submitMobileButton = $('#submit_mobile');
			attachBootstrapValidatorsToSendMobileForm(mobileForm,
					submitMobileButton);

			/*
			 *
			 * ---------- email form handler --------------
			 */

			var emailForm = $('#demosite_email_form');
			var submitEmailButton = $('#submit_email');
			attachBootstrapValidatorsToSendEmailForm(emailForm,
					submitEmailButton);

			/*
			 * ---------- end email form-----------
			 */


			var $demoInstructionsCarousel = $('#demoinstructions_carousel');

			$demoInstructionsCarousel.owlCarousel({
				items : 1, // 10 items above 1000px browser width
				itemsDesktop : [ 1000, 1 ], // 5 items between 1000px and 901px
				itemsDesktopSmall : [ 900, 1 ], // betweem 900px and 601px
				itemsTablet : [ 600, 1 ], // 2 items between 600 and 0
				itemsMobile : false,
				autoplay : true,
				rewind : true
			// itemsMobile disabled - inherit from itemsTablet
			// option
			});

		});
