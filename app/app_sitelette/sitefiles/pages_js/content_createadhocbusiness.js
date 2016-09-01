var fetchDomain;
var createadhocbusinessUrl;


function fetchDomain_form(){
 var request = $
   .ajax({
    url : fetchDomain,
    method : "GET",
    contentType : 'application/json',
    accepts : {
     json : "application/json"
    }

   })
   .done(
     function(result) {
         for(var i=0;i<result.length;i++)
             {
            $("<option></option>", {value: result[i].enumText,text : result[i].displayText }).appendTo('#domain');
             }
         
     }).fail(function(jqXHR, textStatus, errorThrown) { });

}

function attachBootstrapValidatorsToRegistrationForm() {
 /*
  * attach to bootstrapvalidator events
  */
 var form = $('#emailRegistrationForm');

 // IMPORTANT: You must declare .on('init.field.fv')
 // before calling .formValidation(options)
 form
   .on('init.field.fv', function(e, data) {
    $('#emailRegistrationSubmit').prop('disabled', true);
    // data.fv --> The FormValidation instance
    // data.field --> The field name
    // data.element --> The field element
    var $icon = data.element.data('fv.icon'), options = data.fv.getOptions(), // Entire
    // options
    validators = data.fv.getOptions(data.field).validators; // The
    // field
    // validators
    if (validators.notEmpty && options.icon && options.icon.required) {
     // The field uses notEmpty validator
     // Add required icon
     $icon.addClass(options.icon.required).show();
    }
   })
   .formValidation(
     {
      framework : 'bootstrap',

      err : {
       container : function($field, validator) {
        return $field.parent().next('.validationErrorMessageClass');
       }
      },
      icon : {
       required : 'glyphicon glyphicon-asterisk',
       valid : 'glyphicon glyphicon-ok',
       invalid : 'glyphicon glyphicon-remove',
       validating : 'glyphicon glyphicon-refresh'
      },
      button : {
       selector : '#emailRegistrationSubmit'
      },
      fields : {
       agreementCheckboxSASLOwner : {
        trigger : 'keyup change',
        validators : {
         notEmpty : {
          message : 'Please acknowldge the terms and conditions in order to proceed'
         },
        },
        onSuccess : function(e, data) {

        },
        onError : function(e, data) {

        }
       },
       businessName : {
        trigger : ' blur',
        validators : {
         notEmpty : {
          message : 'Business name is Required'
         }
        }
       },
       businessPhoneNo : {
        trigger : ' blur',
        validators : {
         notEmpty : {
          message : 'Business phone number is Required'
         }, numeric : {
          message : 'Business phone number should be numeric'
         }
        }
       },

      }
     // end fields
     })// Enable the password/confirm password validators if
   // the password is not empty
   .on('status.field.fv', function(e, data) {

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
      /*
       * extract the form data
       */
      var $form = $('#emailRegistrationForm');
      var formValidation = $form.data('formValidation');
      var formObject = $form.serializeObject();
      //console.log(formObject.domain);
         var data={
   "businessName":formObject.businessName,
   "businessPhoneNumber": formObject.businessPhoneNo,
   "domain":formObject.domain,
   "number":'',
   "street":formObject.street,
   "street2":formObject.street2,
   "city":formObject.city,
   "state":formObject.state,
   "zip":formObject.zip,
   "country":formObject.country,
};
      var postPayload = JSON.stringify(data);
      /*
       * use our own function
       */
      submitcreateadhocbusinessFormToAPI(createadhocbusinessUrl, postPayload,formValidation);

      /*
       * 
       */
     }).on('err.form.fv', function(e, data) {

   })
}
function showEmailRegistrationError(msg) {
 var errdiv = $('#emailRegistrationFormErrorDiv')
   .find('.signupErrorMessageDiv');
 errdiv.text(msg);
 $("#emailRegistrationFormErrorDiv").fadeIn('slow');
}

function hideEmailRegistrationError() {
 $("#emailRegistrationFormErrorDiv").fadeOut('slow');
}
function attachButtonHandlers() {

 /*
  * 
  */
 ladda_signup_submit_button = Ladda.create(document
   .querySelector('#emailRegistrationSubmit'));

 /*ladda_login_submit_button = Ladda.create(document
   .querySelector('#emailLoginSubmit'));*/

 /*ladda_next_submit_button = Ladda.create(document
   .querySelector('#waitingForVerification'));

 ladda_build_submit_button = Ladda.create(document
   .querySelector('#buildAppSubmit'));*/

 $('#waitingForVerification').click(function(e) {
  var evt = e ? e : window.event;
  if (evt.preventDefault)
   evt.preventDefault();
  evt.returnValue = false;
  submitNextFormToAPI(getUserAPI, newUID);
 });

 $('#useDemoServerSwitch').on('change', function(e) {
  var evt = e ? e : window.event;
  if (evt.preventDefault)
   evt.preventDefault();
  evt.returnValue = false;
  var demoChecked = $('#useDemoServerSwitch').prop('checked');
  if (demoChecked) {
   api_server_before_demo_switch = communityRequestProfile.api_server;
   communityRequestProfile.api_server = 'simfel.com';
  } else {
   communityRequestProfile.api_server = api_server_before_demo_switch;
  }
  updateAllAPIURLS();
  console.log("Server is now :" + communityRequestProfile.api_server);

 });
}
function submitcreateadhocbusinessFormToAPI(apiurl, postPayload, formValidation) {
 ladda_signup_submit_button.start();
 var request = $
   .ajax({
    url : apiurl,
    method : "POST",
    data : postPayload,
    dataType : "json",
    contentType : 'application/json',
    accepts : {
     json : "application/json"
    }

   })
   .done(
     function(result) {

      ladda_signup_submit_button.stop();

      if (typeof result !== 'undefined') {
       if (typeof result.uID !== 'undefined') {
        newUID = result.uID;
           document.getElementById("emailRegistrationForm").reset();
           var html='<div id="signupErrorDiv" class="alert alert-success " style="width:96%;margin-left:2%"><p style="color:green">The Inviation code for <b>'+result.businessName+'</b> is <b> '+result.userName+'</b></p><p style="color:green" >Please Share this with business and ASK owner to create userid/password for his business.</p></div><br></br></br>';
$('#simpleSignupRow1').hide(); 
$('#simpleSignupRow4').fadeIn('slow');
$("#signup_root").removeClass("force-min-height"); 
           console.log(html);
$("#simpleSignupRow4").html(html);
       }
      } else {
       /*
        * show error
        */

       showEmailRegistrationError("Error encountered");

      }
     }).fail(function(jqXHR, textStatus, errorThrown) {

    var extractedErrorMessage = processAjaxError(jqXHR);
    showEmailRegistrationError(extractedErrorMessage);

   }).always(function() {
    ladda_signup_submit_button.stop();
    formValidation.disableSubmitButtons(false);
   });
}

function updateAllAPIURLS() {
 fetchDomain= communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/billing/getAvailableDomains';
    createadhocbusinessUrl = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/billing/purchaseSASLandSignupLiveOffers';
    //createadhocbusinessUrl = 'http://simfel.com/apptsvc/rest/billing/purchaseSASLandSignupLiveOffers';
}

$(document).ready(function() {
 parseCommunityURL();
 updateAllAPIURLS();
 fetchDomain_form(); 
/*
  * hook up the validators
  */
 attachBootstrapValidatorsToRegistrationForm();
    attachButtonHandlers()
});