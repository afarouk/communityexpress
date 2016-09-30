/*
 * variables for this form. Additional variables
 * like communityRequestProfile.protocol and communityRequestProfile.api_server
 * come from URL parsing.
 */

var newUID;
var newSA;
var newSL;
//
var ladda_signup_submit_button;
var ladda_login_submit_button;
var ladda_next_submit_button;
var ladda_build_submit_button;
var ladda_check_incode_button;
var ladda_create_incode_button
// api and other URLs
var api_server_before_demo_switch;

var isEmailAvailableBootStrap;
var isMobileAvailableBootStrap;
var isUsernameAvailableBootStrap;
var registerEmailAPI;
var createUser;
var loginEmailAPI;
var getUserAPI;
var getFeaturesAPI;
var urlSuffixValidationAPI;
var purchaseBetaSASL;
var portalExpressURL = 'http://sitelettes.com/sites/ext/portalexpress/';
var varifyInovationCodeUrl;

/*
 * for launching portal express
 */

var isEmailAvailableBootStrap;
var isMobileAvailableBootStrap;
var isUsernameAvailableBootStrap;
var fetchDomain;
var createOwnerFromInvitation;
var myScroll;
var featureImageURL = 'https://communitylive.co/apptsvc/static/features/';
var addFeatureToPreview = function(enum_text, url) {
 $('#featuresMenu ul').append(
   '<li id="' + enum_text + '"> <img src="' + url + '"></li>');
};
var removeFeatureFromPreview = function(enum_text) {
 var idstring = '#' + enum_text;
 var $liToRemove = $('#featuresMenu ul').find(idstring);
 if (typeof $liToRemove !== 'undefined') {
  $liToRemove.remove();
 }
};

function showSimpleSignupRow2() {
 $('#simpleSignupRow1').hide();
 $('#simpleSignupRow2').fadeIn('slow');
}

function showSimpleSignupRow3() {
 $('#simpleSignupRow1').hide();
 $('#simpleSignupRow2').hide();
 $('#simpleSignupRow3').fadeIn();
}

function showSimpleSignupRow3B() {
 $('#simpleSignupRow1').hide();
 $('#simpleSignupRow2').hide();
 $('#simpleSignupRow3B').fadeIn();
}
function showSimpleSignupRow4() {
 $('#simpleSignupRow3').hide();
 $('#simpleSignupRow3B').hide();
 $('#simpleSignupRow4').fadeIn();
}

function showEmailRegistrationForm() {
 $('#emailRegistrationForm').formValidation('resetForm', true);
 $('#emailRegistrationResults').hide();
 $('#simpleSignupRow1').fadeIn('slow');
}

function showEmailLoginError(msg) {
 var errdiv = $('#emailLoginFormErrorDiv').find('.signupErrorMessageDiv');
 errdiv.text(msg);
 $("#emailLoginFormErrorDiv").fadeIn('slow');
}

function hideEmailLoginError() {
 $("#emailLoginFormErrorDiv").fadeOut('slow');
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
function showEmailVerificationMessage(alertType, message) {
 var tmpDiv = $('#emailVerificationCheckMessage');
 tmpDiv.removeClass('alert-danger');
 tmpDiv.removeClass('alert-warning');
 tmpDiv.removeClass('alert-success');
 tmpDiv.removeClass('alert-info');
 tmpDiv.addClass(alertType);

 $('#emailVerificationCheckMessageSpan').empty();
 $('#emailVerificationCheckMessageSpan').html(message);
 tmpDiv.fadeIn();

}
function resetEmailRegistrationForm() {
 $('#emailRegistrationForm').formValidation('resetForm', true);

}
function hideEmailRegistrationForm() {
 $('#emailRegistrationForm').hide();
}

function showBuildAppError(msg) {
 var tmpDiv = $('#buildAppSubmitErrorDiv');
 $('#buildAppSubmitErrorSpan').empty();
 $('#buildAppSubmitErrorSpan').html(msg);
 $("#buildAppSubmitErrorDiv").fadeIn('slow');
}
function hideBuildAppError() {
 $("#buildAppSubmitErrorDiv").hide();
 $('#buildAppSubmitErrorSpan').empty();

}

function showBuildSuccess() {
    $('#clkToCRT').hide();
 $('#simpleSignupRow3').hide();

 if (!standaloneBrowser && ipad) {
  /*
   * he is in our Portal app, fire event
   */
  // sendToApp("UID", newUID);
  var src = "js2ios://community_login";
  src = src + "?UID=" + newUID + "&serviceAccommodatorId=" + newSA
    + "&serviceLocationId=" + newSL + "&server="
    + communityRequestProfile.api_server;
  openCustomURLinIFrame(src);
  showSimpleSignupRow4();
 } else if (standaloneBrowser && ipad) {
  /*
   * he is on iPad but not in our app. Don't launch portal express show link to
   * download ipad app.
   */
  // showEmailRegistrationForm();
  showSimpleSignupRow4();
 } else {
  /*
   * he is on desktop. Reset form, launch portalexpress in new browser
   * window/tab
   */
  // showEmailRegistrationForm();
  showPortalExpressPage(portalExpressURL + '?UID=' + newUID
    + '&ignorehistory=true&server=' + communityRequestProfile.api_server);
 }
}

function showFeatureRetrievalError(msg) {
 $('#simpleSignupRow3').hide();
 var tmpDiv = $('#simpleSignupRow4');
 tmpDiv.find('#signupCongratulationsDiv').hide();
 tmpDiv.find('#signupErrorDiv').text(msg);
 tmpDiv.find('#signupErrorDiv').show();
 tmpDiv.fadeIn();
}

function showPortalExpressPage(src) {

 /* hide everything else */

 $('#simpleSignupRow1').hide();
 $('#portalExpressRow').fadeIn('slow');
    var htm='<center><div style="margin-top:170px"><img src="/images/loading.gif"><p style="color: brown;">Loading....</p></div></center>';
    $('#portalExpressRow').html(htm);
    $("html, body").animate({
  scrollTop : 0
 }, 600);

 createPortalExpressInRow($('#portalExpressRow'), src);

 //showHidePageForPortalExpress(false);

}

function hidePortalExpressPage() {
 $('#portalExpressRow').hide();
 $('#portalExpressRow').empty();
 $('#registrationFormRow1').fadeIn('slow');
 // window.onbeforeunload = undefined;
}

function updateAllAPIURLS() {
 isEmailAvailableBootStrap = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/isEmailAvailableBootStrap';
 isMobileAvailableBootStrap = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/isMobileAvailableBootStrap';
 isUsernameAvailableBootStrap = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/isUsernameAvailableBootStrap';
 registerEmailAPI = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/registerEmail';
 loginEmailAPI = communityRequestProfile.protocol
   + communityRequestProfile.api_server + '/apptsvc/rest/authentication/login';
 getUserAPI = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/getUserDetails';

 getFeaturesAPI = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/billing/retrieveFeaturesByPacakge?packageEnumText=';

 urlSuffixValidationAPI = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/sasl/urlSuffixAvailabilityValidator?urlsuffix=';

 purchaseBetaSASL = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/billing/purchaseSASLBeta';

 isEmailAvailableBootStrap = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/isEmailAvailableBootStrap';
 isMobileAvailableBootStrap = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/isMobileAvailableBootStrap';
 isUsernameAvailableBootStrap = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/authentication/isUsernameAvailableBootStrap';
    fetchDomain= communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/billing/getAvailableDomains';
    createUser = communityRequestProfile.protocol
   + communityRequestProfile.api_server
   + '/apptsvc/rest/billing/purchaseSASLandSignupLiveOffers';
    //createUser = 'http://simfel.com/apptsvc/rest/billing/purchaseSASLandSignupLiveOffers';
    varifyInovationCodeUrl=communityRequestProfile.protocol
   + communityRequestProfile.api_server+'/apptsvc/rest/authentication/verifyInvitationCode'
    //varifyInovationCodeUrl='http://simfel.com/apptsvc/rest/authentication/verifyInvitationCode';

    createOwnerFromInvitation=communityRequestProfile.protocol
   + communityRequestProfile.api_server+'/apptsvc/rest/authentication/createOwnerFromInvitation';
    //createOwnerFromInvitation='http://simfel.com/apptsvc/rest/authentication/createOwnerFromInvitation';
}
// -----------------------
function retrieveDomains(packageEnum, $selection) {
 attachBootstrapValidatorsToBuildAppForm2();
}
function open_vrfyinvcd_sec(){
  $('#simpleSignupRow1').hide();
  $('#VrfyInvCd').show();
    $("#signup_root").removeClass("force-min-height");
}
function close_vrfyinvcd_sec(evt){
    evt.preventDefault();
  $('#simpleSignupRow1').show();
  $('#VrfyInvCd').hide();
    $("#signup_root").addClass("force-min-height");
}

function close_createinvcd(){

    $('#crtByInvCd').hide();
    $('#VrfyInvCd').show();
}
var varifiedinvitationcode;
function verifyInvitationCode(evt){
    evt.preventDefault();
    ladda_check_incode_button.start();
    var code=$("#invitationCode").val();
   var url= varifyInovationCodeUrl+'?invitationCode='+code;
     var request = $
   .ajax({
    url : url,
    method : "GET",
    contentType : 'application/json',
    accepts : {
     json : "application/json"
    }

   })
   .done(
     function(result) {
         //console.log(result);
         varifiedinvitationcode=code;
         $('#InvitationSc1Form').formValidation('resetForm', true);
         $("#errorDv").hide('fast');
         $('#VrfyInvCd').hide();
         $('#crtByInvCd').show();
         $("#invitationCode2").val(varifiedinvitationcode);
         $('#invitationCode2').prop('disabled', true);
         //attachBootstrapValidatorsToInvitationForm();
         ladda_check_incode_button.stop();
     }).fail(function(jqXHR, textStatus, errorThrown) {
       ladda_check_incode_button.stop();
       var msg=JSON.parse(jqXHR.responseText);
       $("#errorDv").show('fast');
       $("#errorDv").html(msg.error.message);
   });
}

function createOwnerByInvitation(evt){
       evt.preventDefault();

    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var email=$('#invitationEmail').val();
    if(email.trim()=='' || regex.test(email)==false){
       $("#errorDv2").show('fast');
       $("#errorDv2").html("please enter a valid email");
        return false;
    }
    else if($('#invitationPsw').val().trim()=='' || $('#invitationPsw').val().length<6)
        {
       $("#errorDv2").show('fast');
       $("#errorDv2").html("Password length must be greater than 5");
        }
    else if($('#invitationPsw').val()!=$('#invitationCPsw').val()){
       $("#errorDv2").show('fast');
       $("#errorDv2").html("Password not match to confirm password");
         return false;
    }
    else{
        ladda_create_incode_button.start();
        var data={
 "invitationCode": varifiedinvitationcode,
 "email":$('#invitationEmail').val(),
 "password":$('#invitationPsw').val(),
 "username":$('#invitationEmail').val()
};
    var data=JSON.stringify(data);
         var request = $
   .ajax({
    url : createOwnerFromInvitation,
    method : "PUT",
    data : data,
    contentType : 'application/json',
    accepts : {
     json : "application/json"
    }

   })
   .done(
     function(result) {
         $('#InvitationSc2Form').formValidation('resetForm', true);
         $("#errorDv2").hide('fast');
         varifiedinvitationcode='';
         //alert('Successfully Done.');
         if (typeof result !== 'undefined') {
       if (typeof result.uid !== 'undefined') {
        newUID = result.uid;
           console.log("ppp_uid="+newUID);
           $('#crtByInvCd').hide('fast');
           $('#clkToCRT').show();
           $("html, body").animate({
  scrollTop : 0
 }, 600);
       }}
         ladda_create_incode_button.stop();
         //$('#InvitationSc2').modal('hide');

     }).fail(function(jqXHR, textStatus, errorThrown) {
       var msg=JSON.parse(jqXHR.responseText);
       $("#errorDv2").show('fast');
       $("#errorDv2").html(msg.error.message);
       ladda_create_incode_button.stop();
   });
    }

}

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

function retrieveActiveFeatures(packageEnum, $featuresRow) {
 // ladda_signup_step2.start();

 $
   .ajax({
    type : "GET",
    url : getFeaturesAPI + packageEnum,
    accepts : {
     json : "application/json"
    }
   })
   .done(
     function(jqXHR) {
      // console.log(" success ");
      var feature;
      if (typeof jqXHR.features !== 'undefined') {
       var startedRow = false;
       $featuresRow.empty();
       $
         .each(
           jqXHR.features,
           function(index, value) {
            if (this.displayText !== undefined) {
             // console.log(this.displayText);

             $featuresRow
               .append('<div class="col-sm-4 col-md-4 col-lg-4"><table class="featureBlock"><tr><td class="featureImage"><img class="featureImage" src="'
                 + this.url
                 + '" /></td>'
                 + '<td class="checkboxTD"  ><input class="featureSelectionCheckbox" type="checkbox"  name="'
                 + this.enumText
                 + '" id="'
                 + this.enumText
                 + '" displayText="'
                 + this.displayText
                 + '" url="'
                 + this.url
                 + '" preSelected="'
                 + this.preSelected
                 + '" /></td></tr><tr><td colspan="2" class="displayText">'
                 + this.displayText + '</td></tr>' + '</table>');
            }
           });

       /*
        * replace standard checkbox
        */
       $featuresRow.find('input').radiobutton({
        className : 'jquery-checkbox',
        checkedClass : 'jquery-checkbox-on'
       });

       $featuresRow.find('.jquery-checkbox').on('click', function(event) {
        var $anchorclicked = $($(event.target)[0]);
        var selected = $anchorclicked.hasClass('jquery-checkbox-on');
        var enumText = $anchorclicked.attr('name');
        var v1 = $anchorclicked.parent();
        var v2 = v1.parent();
        var v3 = v2.find('input');
        var url = v3.attr('url');
        if (selected) {
         addFeatureToPreview(enumText, url);
         // console.log(" add :" +
         // enumText);
        } else {
         removeFeatureFromPreview(enumText);
         // console.log(" remove :" +
         // enumText);
        }

       });

       /*
        * x modify the checkbxes based on feature properties
        */
       var tds = $featuresRow
         .find('.checkboxTD')
         .each(
           function() {
            var name = $(this).find('input').attr('name');
            // console.log(" name:" + name);
            var preSelected = ($(this).find('input').attr('preSelected') === 'true') ? true
              : false;
            if (preSelected === true) {// .'FE_MEDIA_GALLERY_FREE'
             // ===
             // name)
             // {
             $(this).find('div').addClass('disabled');
             $(this).find('a').click();
             $(this).find('.jquery-checkbox').off('click');
            }
           })
       myScroll = new IScroll('#featuresMenuWrapper');
       // showStep2();
       // $('#signup_step3').prop('disabled', false);
       /*
        * attach formvalidation validators
        */

       attachBootstrapValidatorsToBuildAppForm();
      }

     }).fail(function(jqXHR, textStatus, errorThrown) {
    var msg = processAjaxError(jqXHR);
    showFeatureRetrievalError(msg);
   }).always(function(jqXHR, textStatus, errorThrown) {
    // ladda_signup_step2.stop();
   });
}

// -------------------------------
/*
 * API call for submission
 */

function submitEmailRegistrationFormToAPI(apiurl, postPayload, formValidation) {
 ladda_signup_submit_button.start();
 var request = $
   .ajax({
    url :apiurl ,
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
           $('#simpleSignupRow1').hide('fast');
           $('#clkToCRT').show();
           $("html, body").animate({
  scrollTop : 0
 }, 600);
           //showBuildSuccess();
             //showPortalExpressPage(portalExpressURL + '?UID=' + newUID);
        /*showEmailVerificationMessage(
          'alert-info',
          "Please verify your email. Check your email account for a message from Sitelettes.");

        showSimpleSignupRow2();*/

       }
          else
              {
                 /* var html='<h1 class="text-center">Create your mobile streaming app</h1><div class="alert fade in alert-success" style="width:80%;margin-left:10%" id="emailVerificationCheckMessage"><span id="emailVerificationCheckMessageSpan">Your account has been created successfully. Please verify your email. After verfication, click next to continue.</span></div><div class="form-group "><div class="col-lg-offset-3 col-md-offset-3  col-sm-offset-3 col-lg-9 col-md-9 col-sm-9 "><label for="waitingForVerification"> Click next to create your app. </label><button type="submit" id="waitingForVerification" class=" btn btn-lg btn-primary ladda-button" data-style="expand-left" data-size="l" name="waitingForVerification"><span class="ladda-label">Next</span><span class="ladda-spinner"></span> <span class="ladda-spinner"></span></button></div></div><br><br></br>';*/

                  //$("#simpleSignupRow1").html(html);
                  //$("#signup_root").removeClass("force-min-height");

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

function submitEmailLoginFormToAPI(apiurl, postPayload, formValidation) {
 ladda_login_submit_button.start();
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

      ladda_login_submit_button.stop();

      if (typeof result !== 'undefined') {
       if (typeof result.uid !== 'undefined') {

        newUID = result.uid;
        console.log('newUID:' + newUID);
        /*
         * check registration level
         */
        if (result.registrationState === 'LEVEL0') {
         /*
          * not verified
          */

         showEmailVerificationMessage(
           'alert-danger',
           "Please verify your email. Check your email account for a message from chalkboardstoday.com.");

        } else {
         $('#emailVerificationCheckMessage').hide();
        }

        showSimpleSignupRow2();

       }
      } else {
       /*
        * show error
        */

       showEmailLoginError("Error encountered");

      }
     }).fail(function(jqXHR, textStatus, errorThrown) {

    var extractedErrorMessage = processAjaxError(jqXHR);
    showEmailLoginError(extractedErrorMessage);

   }).always(function() {
    ladda_login_submit_button.stop();
    formValidation.disableSubmitButtons(false);
   });
}

function submitNextFormToAPI(apiurl, uid) {
 ladda_next_submit_button.start();
 var request = $.ajax({
  url : apiurl + "?UID=" + uid,
  method : "GET"
 }).done(
   function(result) {

    ladda_next_submit_button.stop();

    if (typeof result !== 'undefined') {
     if (result.registrationState === 'LEVEL0') {
      // un-verified email
      showEmailVerificationMessage('alert-danger',
        "Please verify your email. After verfication, click next to continue.")
     } else {
      // verified email
      $('#emailVerificationCheckMessage').hide();


      showSimpleSignupRow3();
      retrieveActiveFeatures('PK_BETA', $('#features_row'));

      //showSimpleSignupRow3B();
      //retrieveDomains('PK_BETA', $('saslDomain'));

     }
    } else {
     /*
      * show possible communication
      */

     showEmailRegistrationError("Error encountered");
     // console.log("Error encountered");
    }
   }).fail(function(jqXHR, textStatus, errorThrown) {
  /*
   * show possible UID error (not valid?)
   */
  var extractedErrorMessage = processAjaxError(jqXHR);
  // showEmailRegistrationError(extractedErrorMessage);
  console.log(extractedErrorMessage);
 }).always(function() {
  ladda_next_submit_button.stop();
 });
}

function submitBuildApp(apiurl, postPayload, formValidation) {
 ladda_build_submit_button.start();
 var request = $.ajax({
  url : apiurl,
  method : "POST",
  data : postPayload,
  dataType : "json",
  contentType : 'application/json',
  accepts : {
   json : "application/json"
  }
 }).done(function(result) {

  if (typeof result !== 'undefined') {
   // console.log(result);
   hideBuildAppError();

   newSA = result.serviceAccommodatorId;
   newSL = result.serviceLocationId;

   showBuildSuccess();
  } else {
   /*
    * show possible communication error
    */

   showBuildAppError("Unable reach service");

  }

 }).fail(function(jqXHR, textStatus, errorThrown) {

  var extractedErrorMessage = processAjaxError(jqXHR);
  showBuildAppError(extractedErrorMessage);

 }).always(function() {
  ladda_build_submit_button.stop();
  formValidation.disableSubmitButtons(false);
 });
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
       passwordForRegistration : {
        enabled : false,
        message : 'The password is not acceptable',
        validators : {
         notEmpty : {
          message : 'A password is required'
         },
         stringLength : {
          max : 15,
          min : 6,
          message : 'Minimum 6 characters, maximum 15.'
         }
        }
       },
       confirmPasswordForRegistration : {
        enabled : false,
        message : 'The password is not acceptable',
        validators : {
         identical : {
          field : 'passwordForRegistration',
          message : 'The passwords must match'
         }
        }
       },
       emailForRegistration : {

        trigger : ' blur',
        verbose: false,
        validators : {
         notEmpty : {
          message : 'The email is required'
         },
         regexp : {
          regexp : '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
          message : 'Not a valid email address'
         },
         remote : {
          url : function(validator, $field, value) {
           // validator is FormValidation
           // instance
           // $field is the field element
           // value is the field value

           return isEmailAvailableBootStrap + '?email=' + value;
          },
          message : 'This email is not available',
          onError : function(e, data) {
           var errmsg = "Signup service not available";
           if (typeof data.result.errorMessage !== 'undefined') {
            errmsg = data.result.errorMessage;
           }

           $('#emailRegistrationForm').formValidation("updateMessage", "email",
             "remote", errmsg);

           return true;
          },
          onSuccess : function(e, data) {

           return true;
          }
         }
        }
       // validators
       },// email
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
         },
          numeric : {
          message : 'Business phone number should be numeric'
         }
        }
       },
       /*domain : {
                    validators: {
                        notEmpty: {
                            message: 'Please select your native language.'
                        }
                    }
                }*/


      }
     // end fields
     })// Enable the password/confirm password validators if
   // the password is not empty
   .on(
     'keyup',
     '[name="passwordForRegistration"]',
     function() {
      var isEmpty = $(this).val() == '';
      $('#emailRegistrationForm').formValidation('enableFieldValidators',
        'passwordForRegistration', !isEmpty).formValidation(
        'enableFieldValidators', 'confirmPasswordForRegistration', !isEmpty);

      // Revalidate the field when user start typing in the
      // password field
      if ($(this).val().length == 1) {
       $('#emailRegistrationForm').formValidation('validateField',
         'passwordForRegistration').formValidation('validateField',
         'confirmPasswordForRegistration');
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
      /*
       * extract the form data
       */
      var $form = $('#emailRegistrationForm');
      var formValidation = $form.data('formValidation');
      var formObject = $form.serializeObject();
      //console.log(formObject.domain);
         var data={
   "email":formObject.emailForRegistration,
   "password":formObject.passwordForRegistration,
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
      submitEmailRegistrationFormToAPI(createUser, postPayload,formValidation);

      /*
       *
       */
     }).on('err.form.fv', function(e, data) {

   })
}

function attachBootstrapValidatorsToLoginForm() {
 /*
  * attach to bootstrapvalidator events
  */
 var form = $('#emailLoginForm');

 // IMPORTANT: You must declare .on('init.field.fv')
 // before calling .formValidation(options)
 form.on('init.field.fv', function(e, data) {
  $('#emailLoginSubmit').prop('disabled', true);
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
 }).formValidation({
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
   selector : '#emailLoginSubmit'
  },
  fields : {
   password : {
    trigger : 'keyup',
    message : 'The password is not acceptable',
    validators : {
     notEmpty : {
      message : 'A password is required'
     }

    }
   },
   email : {
    trigger : 'keyup blur',
    validators : {
     notEmpty : {
      message : 'The email is required'
     },
     emailAddress : {
      message : 'Not a valid email address'
     },
     regexp : {
      regexp : '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
      message : 'Not a valid email address'
     }
    }
   // end validators
   }

  }
 // end fields
 }).on('status.field.fv', function(e, data) {

 }).on('err.field.fv', function(e, data) {

  data.fv.disableSubmitButtons(true);
  /*
   * field has changed, so remove previous error
   */
  hideEmailLoginError();
 }).on('success.field.fv', function(e, data) {

  // Check if there is at least one field which is not validated yet
  // or being validated
  if (data.fv.isValid() === null) {
   data.fv.disableSubmitButtons(true);
  }

  /*
   * field has changed, so remove previous error
   */
  hideEmailLoginError();
 }).on('success.form.fv', function(e, data) {

  // Prevent form submission
  e.preventDefault();
  /*
   * extract the form data
   */
  var $form = $('#emailLoginForm');
  var formValidation = $form.data('formValidation');
  var formObject = $form.serializeObject();

  var postPayload = JSON.stringify(formObject);
  /*
   * use our own function
   */
  submitEmailLoginFormToAPI(loginEmailAPI, postPayload, formValidation);

  /*
   *
   */
 }).on('err.form.fv', function(e, data) {

 })
}

function attachBootstrapValidatorsToBuildAppForm() {
 /*
  * attach to bootstrapvalidator events
  */
 var form = $('#buildAppForm');

 // IMPORTANT: You must declare .on('init.field.fv')
 // before calling .formValidation(options)
 form.on('init.field.fv', function(e, data) {
  $('#buildAppSubmit').prop('disabled', true);
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
 }).find('[name="appNameSimpleSignup"]').keyup(function(e) {
  // update the title
  var $inputElement = $($(e.target)[0]);
  $('#headerPreview').html($inputElement.val());
 }).end()//
 // .on('keyup', '[name="urlSuffixSimpleSignup"]', function(e) {
 // var fv = $('#buildAppForm').data('formValidation');
 // fv.enableFieldValidators('urlSuffixSimpleSignup', true);
 // })//
 .formValidation({
  framework : 'bootstrap',
  err : {
   container : function($field, validator) {
    return $field.parent().next('.validationErrorMessageClass');
   }
  },
  icon : {

  },
  button : {
   selector : '#buildAppSubmit'
  },
  fields : {
   features : {

    selector : '.featureSelectionCheckbox',
    // The field is placed inside .col-xs-4 div instead of
    // .form-group
    row : '.col-xs-4',
    validators : {
     callback : {
      callback : function(value, validator, $field) {
       // Determine the numbers which are generated in
       // captchaOperation
       // console.log("callback validator called on:" +
       // $field[0].name + ":"
       // + $($field[0]).prop('checked'));
       return true;
      }
     }
    }
   },
   appNameSimpleSignup : {
    trigger : 'keyup',
    message : 'Please enter an app name',
    validators : {
     notEmpty : {
      message : 'Please enter an app name'
     },
     stringLength : {
      max : 12,
      min : 6,
      message : 'Minimum 6 characters, maximum 12.'
     }
    }
   }
  /*
   * urlSuffixSimpleSignup : { verbose : false, trigger : 'keyup', // onSuccess :
   * function(e, data) { // console.log(" urlSuffixSimpleSignup validator
   * success"); // if (data.fv.isValid() === null) { //
   * data.fv.disableSubmitButtons(true); // } else { //
   * data.fv.disableSubmitButtons(false); // } // }, // onError : function(e,
   * data) { // console.log(" urlSuffixSimpleSignup validator Failure"); // },
   * validators : { notEmpty : { message : 'Please enter a URL suffix' }, regexp : {
   * regexp : /^[a-z0-9]+$/i, message : 'Alphanumeric characters only' },
   * stringLength : { min : 6, message : 'Minimum 6 characters' }, remote : {
   * message : 'This url suffix is not available', delay : 300, url :
   * function(validator, $field, value) { return urlSuffixValidationAPI + value; },
   * onError : function(e, data) { var errmsg = "Signup service not available";
   * if (typeof data.result.errorMessage !== 'undefined') { errmsg =
   * data.result.errorMessage; }
   *
   * errmsg = 'This url suffix is not available';
   * $('#buildAppForm').formValidation("updateMessage", "urlSuffixSimpleSignup",
   * "remote", errmsg); }, onSuccess : function(e, data) { } } } }
   */
  // urlSuffixSimpleSignup
  }
 // end fields
 }).on('status.field.fv', function(e, data) {

 }).on('err.field.fv', function(e, data) {
  // data.fv.disableSubmitButtons(true);
  /*
   * field has changed, so remove previous error
   */
 }).on('success.field.fv', function(e, data) {
  // Check if there is at least one field which is not validated yet
  // or being validated
  if (data.fv.isValid() === null) {
   data.fv.disableSubmitButtons(true);
  } else {
   data.fv.disableSubmitButtons(false);
  }
  // console.log('success on field: ' + data.field);

 }).on(
   'success.form.fv',
   function(e, data) {
    // Prevent form submission
    e.preventDefault();
    /*
     * extract the form data
     */
    /*
     * pull up the features, create object, send to API
     *
     */

    var saslName = $('#buildAppForm').find('input[name="appNameSimpleSignup"]')
      .val();

    var urlSuffix = null;
    // var urlSuffix = $('#buildAppForm').find(
    // 'input[name="urlSuffixSimpleSignup"]').val();

    var features = [];
    var buttons = $('#features_row').find('input');
    buttons.each(function() {
     var featureEnum = $(this).attr('name');
     var checked = $(this).prop('checked');
     // console.log(featureEnum + " is " + checked);
     if (checked === true) {
      features.push(featureEnum);
     }
    })

    var postableObject = {
     'uid' : newUID,
     'saslName' : saslName,
     'urlSuffix' : urlSuffix,
     'features' : features
    }

    var $form = $('#buildAppForm');
    var formValidation = $form.data('formValidation');
    var formObject = $form.serializeObject();

    var postPayload = JSON.stringify(postableObject);

    // console.log(postPayload);
    submitBuildApp(purchaseBetaSASL, postPayload, formValidation);
    /*
     *
     */
   }).on('err.form.fv', function(e, data) {

 })
}

function attachBootstrapValidatorsToBuildAppForm2() {
 /*
  * attach to bootstrapvalidator events
  */
 var form = $('#buildAppForm2');

 // IMPORTANT: You must declare .on('init.field.fv')
 // before calling .formValidation(options)
 form.on('init.field.fv', function(e, data) {
  $('#buildAppSubmit2').prop('disabled', true);
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
 }).find('[name="appNameSimpleSignup"]').keyup(function(e) {
  // update the title
  var $inputElement = $($(e.target)[0]);
  $('#headerPreview').html($inputElement.val());
 }).end()//
 // .on('keyup', '[name="urlSuffixSimpleSignup"]', function(e) {
 // var fv = $('#buildAppForm').data('formValidation');
 // fv.enableFieldValidators('urlSuffixSimpleSignup', true);
 // })//
 .formValidation({
  framework : 'bootstrap',
  err : {
   container : function($field, validator) {
    return $field.parent().next('.validationErrorMessageClass');
   }
  },
  icon : {

  },
  button : {
   selector : '#buildAppSubmit2'
  },
  fields : {
   features : {

    selector : '.featureSelectionCheckbox',
    // The field is placed inside .col-xs-4 div instead of
    // .form-group
    row : '.col-xs-4',
    validators : {
     callback : {
      callback : function(value, validator, $field) {
       // Determine the numbers which are generated in
       // captchaOperation
       // console.log("callback validator called on:" +
       // $field[0].name + ":"
       // + $($field[0]).prop('checked'));
       return true;
      }
     }
    }
   },
   appNameSimpleSignup : {
    trigger : 'keyup',
    message : 'Please enter an app name',
    validators : {
     notEmpty : {
      message : 'Please enter an app name'
     },
     stringLength : {
      max : 12,
      min : 6,
      message : 'Minimum 6 characters, maximum 12.'
     }
    }
   }
  /*
   * urlSuffixSimpleSignup : { verbose : false, trigger : 'keyup', // onSuccess :
   * function(e, data) { // console.log(" urlSuffixSimpleSignup validator
   * success"); // if (data.fv.isValid() === null) { //
   * data.fv.disableSubmitButtons(true); // } else { //
   * data.fv.disableSubmitButtons(false); // } // }, // onError : function(e,
   * data) { // console.log(" urlSuffixSimpleSignup validator Failure"); // },
   * validators : { notEmpty : { message : 'Please enter a URL suffix' }, regexp : {
   * regexp : /^[a-z0-9]+$/i, message : 'Alphanumeric characters only' },
   * stringLength : { min : 6, message : 'Minimum 6 characters' }, remote : {
   * message : 'This url suffix is not available', delay : 300, url :
   * function(validator, $field, value) { return urlSuffixValidationAPI + value; },
   * onError : function(e, data) { var errmsg = "Signup service not available";
   * if (typeof data.result.errorMessage !== 'undefined') { errmsg =
   * data.result.errorMessage; }
   *
   * errmsg = 'This url suffix is not available';
   * $('#buildAppForm').formValidation("updateMessage", "urlSuffixSimpleSignup",
   * "remote", errmsg); }, onSuccess : function(e, data) { } } } }
   */
  // urlSuffixSimpleSignup
  }
 // end fields
 }).on('status.field.fv', function(e, data) {

 }).on('err.field.fv', function(e, data) {
  // data.fv.disableSubmitButtons(true);
  /*
   * field has changed, so remove previous error
   */
 }).on('success.field.fv', function(e, data) {
  // Check if there is at least one field which is not validated yet
  // or being validated
  if (data.fv.isValid() === null) {
   data.fv.disableSubmitButtons(true);
  } else {
   data.fv.disableSubmitButtons(false);
  }
  // console.log('success on field: ' + data.field);

 }).on(
   'success.form.fv',
   function(e, data) {
    // Prevent form submission
    e.preventDefault();
    /*
     * extract the form data
     */
    /*
     * pull up the features, create object, send to API
     *
     */

    var saslName = $('#buildAppForm2').find('input[name="appNameSimpleSignup"]')
      .val();

    var urlSuffix = null;
    // var urlSuffix = $('#buildAppForm').find(
    // 'input[name="urlSuffixSimpleSignup"]').val();

    var features = [];
    var buttons = $('#features_row').find('input');
    buttons.each(function() {
     var featureEnum = $(this).attr('name');
     var checked = $(this).prop('checked');
     // console.log(featureEnum + " is " + checked);
     if (checked === true) {
      features.push(featureEnum);
     }
    })

    var postableObject = {
     'uid' : newUID,
     'saslName' : saslName,
     'urlSuffix' : urlSuffix,
     'features' : features
    }

    var $form = $('#buildAppForm2');
    var formValidation = $form.data('formValidation');
    var formObject = $form.serializeObject();

    var postPayload = JSON.stringify(postableObject);

    // console.log(postPayload);
    submitBuildApp(purchaseBetaSASL, postPayload, formValidation);
    /*
     *
     */
   }).on('err.form.fv', function(e, data) {

 })
}

function attachButtonHandlers() {

 /*
  *
  */
 ladda_signup_submit_button = Ladda.create(document
   .querySelector('#emailRegistrationSubmit'));

 /*ladda_login_submit_button = Ladda.create(document
   .querySelector('#emailLoginSubmit'));*/

 ladda_next_submit_button = Ladda.create(document
   .querySelector('#waitingForVerification'));

 ladda_build_submit_button = Ladda.create(document
   .querySelector('#buildAppSubmit'));

ladda_check_incode_button = Ladda.create(document
   .querySelector('#verifyInv'));

    ladda_create_incode_button=Ladda.create(document
   .querySelector('#InvitationSubmit2'));

 $('#waitingForVerification').click(function(e) {
  var evt = e ? e : window.event;
  if (evt.preventDefault)
   evt.preventDefault();
  evt.returnValue = false;
     console.log(newUID);
  submitNextFormToAPI(getUserAPI, newUID);
 });

 /*-----------*/

 // $('#showPortalExpressPageButton').click(
 // function(e) {
 // var evt = e ? e : window.event;
 // if (evt.preventDefault)
 // evt.preventDefault();
 // evt.returnValue = false;
 //
 // /*
 // * have to build iframe here because of jquery firefox bug.
 // */
 //
 // //
 // if (!standaloneBrowser && ipad) {
 // /*
 // * he is in our Portal app, fire event
 // */
 // // sendToApp("UID", newUID);
 // var src = "js2ios://community_signup";
 // src = src + "?UID=" + newUID + "&serviceAccommodatorId=" + newSA
 // + "&serviceLocationId=" +
 // newSL+"&server"+communityRequestProfile.api_server;
 // openCustomURLinIFrame(src);
 //
 // } else if (standaloneBrowser && ipad) {
 // /*
 // * he is on iPad but not in our app. Don't launch portal express show link
 // * to download ipad app.
 // */
 // showEmailRegistrationForm();
 //
 // } else {
 // /*
 // * he is on desktop. Reset form, launch portalexpress in new browser
 // * window/tab
 // */
 // showEmailRegistrationForm();
 // showPortalExpressPage(portalExpressURL + '&UID=' + newUID);
 // }
 // //
 // return false;
 //
 // });
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
/*
 * Lets set things up and attach validators, handlers.
 */
$(document).ready(function() {
 parseCommunityURL();
 updateAllAPIURLS();
 fetchDomain_form();
/*
  * hook up the validators
  */
 attachBootstrapValidatorsToRegistrationForm();
 attachBootstrapValidatorsToLoginForm();

 attachButtonHandlers();
 /*
  * is UID defined in url? if so then fire 'Next button with UID'
  */
 if (communityRequestProfile.isUidSpecified) {
  newUID = communityRequestProfile.uid;
  console.log(" got uid");

  submitNextFormToAPI(getUserAPI, newUID);
 }

 // if (standaloneBrowser) {
 // if (ipad) {
 // $('#showPortalExpressLink').hide();
 // } else {
 // $('#showPortalExpressLink').show();
 // }
 // } else {
 // $('#showPortalExpressLink').hide();
 // }
});