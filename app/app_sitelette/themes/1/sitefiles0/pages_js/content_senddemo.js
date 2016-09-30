var mobile_apiurl;
var email_apiurl;


function showEmailResults(success, message) {
 $('#demosite_email_form').data('formValidation').resetForm({
  resetFormData: true
 });
 /* unselect the bootstrap-select input manually using bootstrap-select method*/
 $('#share_email_industry').selectpicker('val', '');
 $('#demosite_email_form').data('formValidation').resetForm({
  resetFormData: true
 });
 $('#demosite_email_form').data('formValidation').disableSubmitButtons(true);

 $('#sendEmailResultRow').removeClass('alert-danger alert-success');
 if (success) {
  $('#sendEmailResultRow').addClass('alert-success');
 } else {
  $('#sendEmailResultRow').addClass('alert-danger');
 }
 $('#sendEmailResultRow div.result_span').html(message);
 $('#sendEmailResultRow').addClass('in');
 setTimeout(function() {
  $('#sendEmailResultRow').removeClass('in')
 }, 5000);
}


function showMobileResults(success, message) {
 $('#demosite_mobile_form').data('formValidation').resetForm({
  resetFormData: true
 });
 /* unselect the bootstrap-select input manually using bootstrap-select method*/
 $('#share_mobile_industry').selectpicker('val', '');
 $('#demosite_mobile_form').data('formValidation').resetForm({
  resetFormData: true
 });
 $('#demosite_mobile_form').data('formValidation').disableSubmitButtons(true);

 $('#sendMobileResultRow').removeClass('alert-danger alert-success');
 if (success) {
  $('#sendMobileResultRow').addClass('alert-success');
 } else {
  $('#sendMobileResultRow').addClass('alert-danger');
 }
 $('#sendMobileResultRow div.result_span').html(message);
 $('#sendMobileResultRow').addClass('in');
 setTimeout(function() {
  $('#sendMobileResultRow').removeClass('in')
 }, 5000);
}


function submitMobileRequest() {
 $.ajax({
  url: mobile_apiurl,
  type: 'POST'
 }).done(function(response) {
  console.log("response :" + response);
  /* TODO show success */
  /*
   * call function to show message
   */
  var message = "Your message has been sent";
  var success = true;
  showMobileResults(success, message);
 }).fail(function(jqXHR, textStatus, errorThrown) {
  var message = processAjaxError(jqXHR);
  var success = false;
  showMobileResults(success, message);
  /*
   *
   */
 }).always(function() {
  ladda_submit_mobile_button.stop();
 });
}

function submitEmailRequest() {
 $.ajax({
  url: email_apiurl,
  type: 'POST'
 }).done(function(response) {
  console.log("response :" + response);
  /* TODO show success */
  /*
   * call function to show message
   */
  var message = "Your message has been sent";
  var success = true;
  showEmailResults(success, message);
 }).fail(function(jqXHR, textStatus, errorThrown) {
  var message = processAjaxError(jqXHR);
  var success = false;
  /*
   * call function to show message
   */
  showEmailResults(success, message);
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
    var $icon = data.element.data('fv.icon'),
     options = data.fv
     .getOptions(), // Entire
     // options
     validators = data.fv.getOptions(data.field).validators; // The
    // field
    // validators
    if (validators.notEmpty && options.icon &&
     options.icon.required) {
     // The field uses notEmpty validator
     // Add required icon
     $icon.addClass(options.icon.required).show();
    }
   })
  .find('#demosite_mobile_form')
  .change(function(e) {
   $('#demosite_mobile_form').formValidation('revalidateField', 'share_mobile_industry');
  })
  .end()
  .formValidation({
   framework: 'bootstrap',
   icon: {
    required: 'glyphicon glyphicon-asterisk',
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
   },
   button: {
    selector: '#submit_mobile',
   },
   fields: {
    share_mobile: {
     trigger: 'keyup change blur',
     message: 'A valid US mobile number is required',
     validators: {
      notEmpty: {
       message: 'A valid US mobile number is required'
      },
      phone: {
       country: 'US',
       message: 'The value is not valid US phone number'
      }
     }
    },
    certify_mobile: {
     trigger: 'keyup change',
     validators: {
      notEmpty: {
       message: 'Please certify that the recipient has agreed.'
      },
     },
     onSuccess: function(e, data) {

     },
     onError: function(e, data) {

     }
    },
    share_mobile_industry: {
     validators: {
      notEmpty: {
       message: 'Please select an industry.'
      }
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

    mobile_apiurl = communityRequestProfile.protocol +
     communityRequestProfile.api_server +
     '/apptsvc/rest/html/sendDemoToMobile?demoType=CHALKBOARDS&domain=' +
     $('#share_mobile_industry').val() +
     '&toMobile=' +
     communityRequestProfile.mobile;
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
    var $icon = data.element.data('fv.icon'),
     options = data.fv
     .getOptions(), // Entire
     // options
     validators = data.fv.getOptions(data.field).validators; // The
    // field
    // validators
    if (validators.notEmpty && options.icon &&
     options.icon.required) {
     // The field uses notEmpty validator
     // Add required icon
     $icon.addClass(options.icon.required).show();
    }
   })
  .find('#demosite_email_form')
  .change(function(e) {
   $('#demosite_email_form').formValidation('revalidateField', 'share_email_industry');
  })
  .end()
  .formValidation({
   framework: 'bootstrap',
   icon: {
    required: 'glyphicon glyphicon-asterisk',
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
   },

   button: {
    selector: '#submit_email',
   },
   fields: {
    share_email: {
     trigger: 'keyup change blur',
     message: 'A valid email is required',
     validators: {
      notEmpty: {
       message: 'A valid email is required'
      },

      emailAddress: {
       message: 'The value is not a valid email address'
      }
     }
    },
    certify_email: {
     trigger: 'keyup change',
     validators: {
      notEmpty: {
       message: 'Please certify that the recipient has agreed.'
      },
     },
     onSuccess: function(e, data) {

     },
     onError: function(e, data) {

     }
    },
    share_email_industry: {
     validators: {
      notEmpty: {
       message: 'Please select an industry.'
      }
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

    ladda_submit_email_button.start();

    var $form = $(e.target); // The form instance
    communityRequestProfile.email = $form.find(
     'input[name="share_email"]').val();

    email_apiurl = communityRequestProfile.protocol +
     communityRequestProfile.api_server +
     '/apptsvc/rest/html/sendDemoToEmail?demoType=CHALKBOARDS&domain=' +
     $('#share_email_industry').val() +
     '&toEmail=' +
     communityRequestProfile.email;
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
  /* Style the select elements */
  $('.selectpicker').selectpicker();

  urlparams = parseHashBangArgs();
  console.log(urlparams);


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

  /* hack. normally we use communitylive as default server.
  but for this, the default is simfel */
  if(communityRequestProfile.api_server==='communitylive.ws'){
    communityRequestProfile.api_server='simfel.com';
  }
  /*
  var $demoInstructionsCarousel = $('#demoinstructions_carousel');

  $demoInstructionsCarousel.owlCarousel({
   items: 1, // 10 items above 1000px browser width
   itemsDesktop: [1000, 1], // 5 items between 1000px and 901px
   itemsDesktopSmall: [900, 1], // betweem 900px and 601px
   itemsTablet: [600, 1], // 2 items between 600 and 0
   itemsMobile: false,
   autoplay: true,
   rewind: true
    // itemsMobile disabled - inherit from itemsTablet
    // option
  });
	*/
 });
