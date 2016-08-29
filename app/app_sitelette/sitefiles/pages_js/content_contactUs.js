function hideEmailRegistrationError() {
 $("#emailRegistrationFormErrorDiv").fadeOut('slow');
}

function showEmailResultMessage(success, messageToShow) {
 if (success) {
  $('#contactUsFormRow').hide();
  $('#contactUsSuccessDiv').empty().text(messageToShow);
  $('#contactUsSuccessDiv').fadeIn();
 } else {
  console.log("error :"+messageToShow);
 }
}


function attachBootstrapValidatorsToContactUsForm() {
 /*
  * attach to bootstrapvalidator events
  */
 var form = $('#contactUsForm');

 // IMPORTANT: You must declare .on('init.field.fv')
 // before calling .formValidation(options)
 form.on('init.field.fv', function(e, data) {
   $('#contactSubmit').prop('disabled', true);
   var $icon = data.element.data('fv.icon'),
    options = data.fv.getOptions(), // Entire
    validators = data.fv.getOptions(data.field).validators;
   if (validators.notEmpty && options.icon && options.icon.required) {
    $icon.addClass(options.icon.required).show();
   }
  }).formValidation({
   framework: 'bootstrap',

   err: {
    container: function($field, validator) {
     return $field.parent().next('.validationErrorMessageClass');
    }
   },
   icon: {
    required: 'glyphicon glyphicon-asterisk',
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
   },
   button: {
    selector: '#contactSubmit'
   },
   fields: {
    name: {
     trigger: ' blur',
     validators: {
      notEmpty: {
       message: 'Name is Required'
      }
     }
    },
    email: {
     trigger: ' blur',
     validators: {
      notEmpty: {
       message: 'The email is required'
      },
      /*
       * emailAddress : { message : 'Not a valid email address' },
       */
      regexp: {
       regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
       message: 'Not a valid email address'
      }
     }
     // validators
    }, // email
    message: {
     trigger: 'blur',
     validators: {
      notEmpty: {
       message: 'Message is Required'
      }
     }
    },
   }
   // end fields
  }) // Enable the password/confirm password validators if
  // the password is not empty
  .on(
   'keyup',
   '[name="message"]',
   function() {
    var isEmpty = $(this).val() == '';
    $('#contactUsForm').formValidation('enableFieldValidators', 'message', !isEmpty);

    // Revalidate the field when user start typing in the
    // password field
    if ($(this).val().length == 1) {
     $('#contactUsForm').formValidation('validateField', 'message')
      .formValidation('validateField', 'message');
    }
   }).on('status.field.fv', function(e, data) {

  }).on('err.field.fv', function(e, data) {

   data.fv.disableSubmitButtons(true);
   /*
    * field has changed, so remove previous error
    */
   hideEmailRegistrationError();
  }).on('success.field.fv', function(e, data) {

   // Check if there is at least one field which is not validated
   // yet
   // or being validated
   if (data.fv.isValid() === null) {
    data.fv.disableSubmitButtons(true);
   }

   /*
    * field has changed, so remove previous error
    */
   hideEmailRegistrationError();
  }).on(
   'success.form.fv',
   function(e, data) {

    // Prevent form submission
    e.preventDefault();
    var apiurl = communityRequestProfile.protocol +
     communityRequestProfile.api_server +
     '/apptsvc/rest/html/sendContactUsEmail';
    var formObject = $("#contactUsForm").serializeObject();
    var postPayload = JSON.stringify(formObject);
    /* ajax calling for mail */
    $.ajax({
     url: apiurl,
     method: "POST",
     data: postPayload,
     dataType: "json",
     contentType: 'application/json',
     accepts: {
      json: "application/json"
     }
    }).done(function(result) {

     // ladda_signup_submit_button.stop();

     if (typeof result !== 'undefined') {
      if (result.success === true) {
       /*
        * OK
        */
       showEmailResultMessage(true, result.explanation);

      }
     } else {
      /*
       * show error
       */

      // showEmailRegistrationError("Error encountered");
     }
    }).fail(function(jqXHR, textStatus, errorThrown) {

     var extractedErrorMessage = processAjaxError(jqXHR);
     showEmailResultMessage(false, extractedErrorMessage);

    }).always(function() {
     // ladda_signup_submit_button.stop();
     // formValidation.disableSubmitButtons(false);
    });

    /*-------------------*/

   }).on('err.form.fv', function(e, data) {

  })
}

/*
 * Lets set things up and attach validators, handlers.
 */
$(document).ready(function() {
 parseCommunityURL();
 attachBootstrapValidatorsToContactUsForm();

});
