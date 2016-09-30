var url = $.url();
var api_server = url.param('server')
var portalExpressIframeSrc;

if (typeof api_server !== 'undefined') {
 console.log("Server overriden: " + api_server);
} else {
 // api_server = 'communitylive.ws';
 api_server = 'simfel.com';
 console.log("Server defaulting: " + api_server);
}

var protocol;
if (api_server === 'localhost:8080') {
 protocol = "http://";
} else {
 protocol = "https://";
}

var ladda_reset_password_submit_button;
var uid;
var newpassword;
var resetcode;

function disableform() {

}

function showResetPasswordResults(success,message) {
 $('#reset_password_message').text(message);   
 $('#reset_password_form_row').hide();
 $('#reset_password_result_row').fadeIn('slow');
 
 
 
 
}
/*
 * This is the ajax API call to submit the password change request.
 */
function submitPasswordChangeRequest() {
 $
   .ajax(
     {
      url : protocol + api_server
        + '/apptsvc/rest/authentication/resetPassword?UID=' + uid
        + '&code='+resetcode+'&newpassword='+newpassword,
      type : 'PUT'
     })
   .done(function(response) {
    console.log("response :" + response);
    /* TODO show success */
    /*
     * call function to show message
     */
    var message="Your password has been changed.";
    var success=true;
    showResetPasswordResults(success,message);
   })
   .fail(
     function(jqXHR, textStatus, errorThrown) {
      var success=false;
      var message="Error occured";
      
      if (typeof jqXHR.responseJSON !== 'undefined') {
       if (typeof jqXHR.responseJSON.error !== 'undefined') {
        if (typeof jqXHR.responseJSON.error.type !== 'undefined') {
         if (jqXHR.responseJSON.error.type.toUpperCase() === 'UNABLETOCOMPLYEXCEPTION') {
             message= "Error: " + jqXHR.responseJSON.error.message ;
         } else if (jqXHR.responseJSON.error.type.toUpperCase() === 'PANICEXCEPTION') {
            message=    "Panic Error: " + jqXHR.responseJSON.error.message ;
         }
        }
       } else {
         message=textStatus;
       }
      }

      /*
       * call function to show message
       */
      showResetPasswordResults(success,message);
      /*
       * 
       */
     }).always(function() {
      ladda_reset_password_submit_button.stop();
   });
}
$(document).ready(
  function() {

   /*
    * check the url and pick out the parameters. Without proper code, disable
    * the dialog so that we avoid false hits or google bot hits.
    * 
    * 
    */

   if (typeof url.param('svc') !== 'undefined') {
    if (url.param('svc') == 'resetpassword') {
     console.log(" detected resetpassword in queryparams");

       resetcode = url.param('code');
       uid = url.param('UID');

    
     var form = $('#reset_password_form');
     /*
      * ok, url is valid.
      * 
      * attach form validator (to check repeated password match and passwords
      * are right length
      */
     /*
      * attach to bootstrapvalidator events
      */
     form
       .on(
         'init.field.bv',
         function(e, data) {

          // data.bv --> The BootstrapValidator
          // instance
          // data.field --> The field name
          // data.element --> The field element

          var $parent = data.element.parents('.form-group'), $icon = $parent
            .find('.form-control-feedback[data-bv-icon-for="' + data.field
              + '"]'), options = data.bv.getOptions(), // Entire
          // options
          validators = data.bv.getOptions(data.field).validators; // The
          // field
          // validators

          if (validators.notEmpty && options.feedbackIcons
            && options.feedbackIcons.required) {
           // The field uses notEmpty validator
           // Add required icon
           $icon.addClass(options.feedbackIcons.required).show();
          }

         }).bootstrapValidator({
        // excluded : [ '#datepicker_start', '#datepicker_end', ':disabled',
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
         password : {
          trigger : 'keyup',
          message : 'The password is not acceptable',
          validators : {
           notEmpty : {
            message : 'The password is required'
           },
           stringLength : {
            max : 15,
            min : 6,
            message : 'Minimum 6 characters, maximum 15.'
           },
           identical : {
            field : 'confirmpassword',
            message : 'The passwords must match'
           }
          }
         },
         confirmpassword : {
          trigger : 'keyup',
          //onSuccess : function(e, data) {
           // enableNextButtonRegistrationForm1();
          ///},
          //onError : function(e, data) {
           // enableNextButtonRegistrationForm1();
          //},
          message : 'The password is not acceptable',
          validators : {
           identical : {
            field : 'password',
            message : 'The passwords must match'
           }
          }
         }
        // end fields
        }

       }).on('success.field.bv', '[name="password"]',
         function(e, data) {
          // $(e.target) --> The field element
          // data.bv --> The BootstrapValidator instance
          // data.field --> The field name
          // data.element --> The field element
        
         }).on('error.form.bv', function(e, data) {
        console.log("error.form.bv event fired");
       }).on('status.field.bv', function(e, data) {

       }).on('success.form.bv', function(e) {
        ladda_reset_password_submit_button.start();
        // Prevent form submission
        e.preventDefault();
        var $form = $(e.target);        // The form instance
        newpassword    = $form.find('input[name="password"]').val();
        // submit Form To API 
        submitPasswordChangeRequest();
       });
     /*
      * setup ladda progress indicator
      */
     ladda_reset_password_submit_button = Ladda.create(document
       .querySelector('#resetpasswordrequestsubmit'));

    } else {
     // console.log("svc="+url.param('svc'));
    }
   } else {
    /* disable the form */
   }
  });
