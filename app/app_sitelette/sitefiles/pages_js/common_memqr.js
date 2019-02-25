var url = $.url();
var api_server = url.param('server')
var portalExpressIframeSrc;

if (typeof api_server !== 'undefined') {
 console.log("Server overriden: " + api_server);
} else {
  api_server = 'communitylive.ws';
 //api_server = 'simfel.com';
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
    $("#memqr_login_anchor").click(function (e){
      e.preventDefault();
      parseCommunityURL();

      alert("iid="+window.communityRequestProfile.iid);
    });
  });
