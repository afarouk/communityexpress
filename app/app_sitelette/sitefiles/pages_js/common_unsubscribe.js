var ladda_unsubscribe_submit_button;
var apiurl;

function disableform() {

}

function  showResults(success, message) {
 $('#unsubscribe_message').text(message);
 $('#unsubscribe_form_row').hide();
 $('#unsubscribe_result_row').fadeIn('slow');

}

function showError(success, message) {
 $('#unsubscribe_error_message').text(message);
 $('#unsubscribe_form_row').hide();
 $('#unsubscribe_error_row').fadeIn('slow');

}
/*
 * This is the ajax API call to submit the password change request.
 */
function submitUnsubscribeRequest() {

 $
   .ajax({
    url : apiurl,
    type : 'PUT'
   })
   .done(function(response) {
    console.log("response :" + response);
    /* TODO show success */
    /*
     * call function to show message
     */
    var message = "Your email has been unsubscribed.";
    var success = true;
    showResults(success, message);
   })
   .fail(
     function(jqXHR, textStatus, errorThrown) {
      var success = false;
      var message = "Error occured";

      if (typeof jqXHR.responseJSON !== 'undefined') {
       if (typeof jqXHR.responseJSON.error !== 'undefined') {
        if (typeof jqXHR.responseJSON.error.type !== 'undefined') {
         if (jqXHR.responseJSON.error.type.toUpperCase() === 'UNABLETOCOMPLYEXCEPTION') {
          message = "Error: " + jqXHR.responseJSON.error.message;
         } else if (jqXHR.responseJSON.error.type.toUpperCase() === 'PANICEXCEPTION') {
          message = "Panic Error: " + jqXHR.responseJSON.error.message;
         }
        }
       } else {
        message = textStatus;
       }
      }

      /*
       * call function to show message
       */
      showResults(success, message);
      /*
       * 
       */
     }).always(function() {
    ladda_unsubscribe_submit_button.stop();
   });
}

$(document).ready(
  function() {
   /*
    * this parses the URL and sets up the global variables object
    * 
    * communityRequestProfile.
    * 
    * Globals are ugly, but ok for now
    */
   parseCommunityURL();

   /*
    * check the url and pick out the parameters. Without proper code, disable
    * the dialog so that we avoid false hits or google bot hits.
    * 
    * 
    */
   /*
    * setup ladda progress indicator
    */
   ladda_unsubscribe_submit_button = Ladda.create(document
     .querySelector('#unsubscribesubmit'));

   if (communityRequestProfile.isService) {
    if (communityRequestProfile.service === 'setSASLNewsletterOptout') {

     apiurl = communityRequestProfile.protocol + communityRequestProfile.api_server
       + '/apptsvc/rest/communication/setSASLNewsletterOptout?email='
       + communityRequestProfile.email + '&serviceAccommodatorId='
       + communityRequestProfile.sa + '&serviceLocationId='
       + communityRequestProfile.sl;
    } else if (communityRequestProfile.service === 'setNewsletterOptout') {
     apiurl = communityRequestProfile.protocol + communityRequestProfile.api_server
       + '/apptsvc/rest/communication/setNewsletterOptout?email='
       + communityRequestProfile.email+'&serviceAccommodatorId='
       + communityRequestProfile.sa + '&serviceLocationId='
       + communityRequestProfile.sl;
    } else {
     /*
      * unrecognized, error
      */
     console.log("nothing to do")
     showError();
    }
    

   

    var form = $('#unsubscribe_form');
    /*
     * ok, url is valid.
     * 
     * attach form validator (to check repeated password match and passwords are
     * right length
     */
    /*
     * attach to bootstrapvalidator events
     */
    form
      .on(
        'init.field.bv',
        function(e, data) {

         // data.bv --> The
         // BootstrapValidator
         // instance
         // data.field --> The field name
         // data.element --> The field
         // element

         var $parent = data.element.parents('.form-group'), $icon = $parent
           .find('.form-control-feedback[data-bv-icon-for="' + data.field
             + '"]'), options = data.bv.getOptions(), // Entire
         // options
         validators = data.bv.getOptions(data.field).validators; // The
         // field
         // validators

         if (validators.notEmpty && options.feedbackIcons
           && options.feedbackIcons.required) {
          // The field uses notEmpty
          // validator
          // Add required icon
          $icon.addClass(options.feedbackIcons.required).show();
         }

        }).bootstrapValidator({
       // excluded : [ '#datepicker_start',
       // '#datepicker_end', ':disabled',
       // ':hidden', ':not(:visible)' ],
       submitButtons : 'button[type="submit"]',
       'resetForm' : true,
       feedbackIcons : {
        required : 'glyphicon glyphicon-asterisk',
        valid : 'glyphicon glyphicon-ok',
        invalid : 'glyphicon glyphicon-remove',
        validating : 'glyphicon glyphicon-refresh'
       },
       fields : {
       // password : {
       // trigger : 'keyup',
       // // onSuccess : function(e, data)
       // {
       // //
       // enableNextButtonRegistrationForm1();
       // // },
       // // onError : function(e, data) {
       // //
       // enableNextButtonRegistrationForm1();
       // // },
       // message : 'The password is not
       // acceptable',
       // validators : {
       // notEmpty : {
       // message : 'The password is
       // required'
       // },
       // stringLength : {
       // max : 15,
       // min : 6,
       // message : 'Minimum 6 characters,
       // maximum 15.'
       // },
       // identical : {
       // field : 'confirmpassword',
       // message : 'The passwords must
       // match'
       // }
       // }
       // },
       // confirmpassword : {
       // trigger : 'keyup',
       // // onSuccess : function(e, data)
       // {
       // //
       // enableNextButtonRegistrationForm1();
       // // /},
       // // onError : function(e, data) {
       // //
       // enableNextButtonRegistrationForm1();
       // // },
       // message : 'The password is not
       // acceptable',
       // validators : {
       // identical : {
       // field : 'password',
       // message : 'The passwords must
       // match'
       // }
       // }
       // }
       // end fields
       }

      })
      // .on('success.field.bv', '[name="password"]',
      // function(e, data) {
      // // $(e.target) --> The field element
      // // data.bv --> The BootstrapValidator
      // instance
      // // data.field --> The field name
      // // data.element --> The field element
      //
      // }).on('error.form.bv', function(e, data) {
      // console.log("error.form.bv event fired");
      // })
      .on('status.field.bv', function(e, data) {

      }).on('success.form.bv', function(e) {
       ladda_unsubscribe_submit_button.start();
       // Prevent form submission
       e.preventDefault();
       // var $form = $(e.target); // The form
       // instance
       // newpassword =
       // $form.find('input[name="password"]').val();
       // submit Form To API
       submitUnsubscribeRequest();
      });

   } else {
    console.log("nothing to do")
    showError();

    /*
     * may be show error message?
     */
   }
  });
