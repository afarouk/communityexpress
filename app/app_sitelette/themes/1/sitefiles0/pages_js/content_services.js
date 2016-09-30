/*
 * 
 * var url = $.url(); // var api_server = url.param('server')
 * 
 * if (typeof api_server !== 'undefined') { console.log("Server overriden: " +
 * api_server); } else { if (typeof url.param('demo') !== 'undefined') {
 * api_server = 'simfel.com'; } else { api_server = 'communitylive.ws'; }
 * console.log("Server defaulting: " + api_server); }
 * 
 * var protocol; if (api_server === 'localhost:8080') { protocol = "http://"; }
 * else { protocol = "https://"; }
 */
// ------------------------------
function showPortalExpressPage(portalExpressURL) {
 console.log(" show portalexpress PAGE called");
 /*
  * load the portal express URL with the given UID
  */
 window.open(portalExpressURL);
}

function showPortalExpressIframe(divId, UID) {
 console.log(" show portalexpress IFRAME called");
 // $('#signupResultRow').hide();
 // $('#portalExpressRow').fadeIn('slow');
 //
 // var iFrameElement = document.createElement('iframe');
 // iFrameElement.setAttribute('id', 'signupModalIframe');
 // iFrameElement.setAttribute('src', portalExpressIframeSrc);
 // iFrameElement.setAttribute('width', '99.6%');
 // iFrameElement.setAttribute('height', '750px');
 // iFrameElement.setAttribute('frameborder', '0');
 //
 // $('#portalExpressRow2').append(iFrameElement);

}
// ------------------------------

// -----------------------------

function showUtilityResult(type, message) {
 /*
  * remove the place holder..
  */
 $('#pleaseWait').hide();
 var $messageCol = $('#messageCol');
 /*
  * create and append an alert
  */

 $messageCol.append('<div class="alert   ' + type + '">' + message + '</div>');

 $('#messageRow').show();
 $('#doneRow').fadeIn();
}



$(document).ready(
  function() {
   parseCommunityURL();
   // console.log("common_content_services.js loaded...");
   

   if (communityRequestProfile.isEmailVerification) {
    $.ajax(
      {
       url : communityRequestProfile.protocol
         + communityRequestProfile.api_server
         + '/apptsvc/rest/authentication/verifyEmail/?userName='
         + communityRequestProfile.userName + "&code="
         + communityRequestProfile.code,
       type : 'PUT'
      }).done(function(response) {
     console.log("response :" + response);
     if (typeof response.emailVerified !== 'undefined') {
      if (response.emailVerified === true) {
       showUtilityResult('alert-success', "Success! " + response.message);
       // $('#email_messageDiv').text("Success! " + response.message);
      }
     }
    }).fail(function(jqXHR, textStatus, errorThrown) {
     var message = processAjaxError(jqXHR);
     var success = false;

     showUtilityResult('alert-danger', message);

    })//
    .always(function() {
     console.log("complete");
    });
   } else {
    // console.log("did not detect email verification in query param");
   }
  });
