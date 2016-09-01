var formSubmissionURL;
var portalExpressURL;

var url;
var api_server;
var api_server_before_demo_switch = "https://communitylive.ws/";
var resetPassUrl;

/*
 * parse the url
 */
function parseHashBangArgs(aURL) {
 aURL = aURL || window.location.href;
 var vars = {};
 var hashes = aURL.slice(aURL.indexOf('?') + 1).split('&');
 for (var i = 0; i < hashes.length; i++) {
  var hash = hashes[i].split('=');
  if (hash.length > 1) {
   vars[hash[0]] = hash[1];
  } else {
   vars[hash[0]] = null;
  }
 }
 return vars;
}

function toggleNavBarOnSignUpPanel() {
 if ($('.navbar-wrapper').is(':visible')) {
  $('.navbar-wrapper').hide();
  $('#dashboard_login').removeClass('push_down_for_menu');
  $('#toggleMenuButton').text("Show Menu")
 } else {
  $('.navbar-wrapper').fadeIn('slow');
  $('#dashboard_login').addClass('push_down_for_menu');
  $('#toggleMenuButton').text("Hide Menu")
 }
}

function showPortalExpress() {
 $('#toggleMenuButton').show();
 toggleNavBarOnSignUpPanel();
 $('#loginFormRow').hide();
 $('#portalExpressRow').fadeIn('slow');

}

function hidePortalExpress() {

 $('#portalExpressRow').hide();
 $('#portalExpressRow').empty();
 $('#loginModalRow').fadeIn('slow');
}

function showLoginError(msg) {
 $('#loginErrorDiv').text(msg);
 $("#loginErrorDiv").addClass("in");
 $("#loginError").show();

}

function hideLoginError() {
 $("#loginError").hide();

}

function open_forgot_sec() {
 $('#loginFormRow').hide();
 $('#loginResultRow').hide();
 $('#forgotPasswordRw').show();

}

function open_login_sec(evt) {
 evt.preventDefault();
 $('#forgotPasswordRw').hide();
 $('#loginFormRow').show();

}

function submitResetPass(evt) {

 evt.preventDefault();
 var email = $('#emailForForgotPass').val();
 /*var url='http://simfel.com:8080/apptsvc/rest/authentication/sendEmailForResetPassword?usernameOrEmail='+email;*/
 var url = resetPassUrl + email;
 var request = $
  .ajax({
   url: url,
   method: "PUT",
   contentType: 'application/json',
   accepts: {
    json: "application/json"
   }

  })
  .done(
   function(result) {
    $('#aldv').show();
    $('#wrongReset').hide();
    $('#al_ss').html(result.explanation);

   }).fail(function(jqXHR, textStatus, errorThrown) {
   $('#aldv').hide();
   var msg = JSON.parse(jqXHR.responseText);
   $('#wrongReset').show();
   $("#al_ww").html(msg.error.message);

  });

}

$(document)
 .ready(
  function() {
   //$('#portalexpress_embeddedApp').html('');
   console.log("SASl=" + sessionStorage.SASL + "SA=" + sessionStorage.SA + "Sl=" + sessionStorage.SL + "UID=" + sessionStorage.UID);
   if (sessionStorage.UID) {
    console.log(sessionStorage.IFRM);
    $('#loginFormRow').hide();
    $('#portalExpressRow').fadeIn('slow');
    var iFrameElement = document.createElement('iframe');
    iFrameElement.setAttribute('id', 'portalexpress_iframe');
    iFrameElement.setAttribute('src', sessionStorage.IFRM);
    iFrameElement.setAttribute('frameborder', '0');
    iFrameElement.setAttribute('width', '99.5%');
    iFrameElement.setAttribute('height', '750px');
    iFrameElement.setAttribute('style', 'overflow-y:hidden;');
    $('#portalexpress_embeddedApp').append(iFrameElement);
   }
   /*sessionStorage.UID='';
   sessionStorage.SASL='';
   sessionStorage.SA='';
   sessionStorage.SL='';
   sessionStorage.clear();*/
   $('#toggleMenuButton').on('click', function() {
    toggleNavBarOnSignUpPanel();
   });
   /*
    * ------------ check the URL and show login if ?s=login
    *
    */
   vars = parseHashBangArgs();

   for (var key in vars) {
    // console.log('key:'+key+', value:'+vars[key]);
    if (key == "s" && vars[key] == 'login') {
     /*
      * show login
      */
     $('#dashboard_login').fadeIn();
     $('#loginFormRow').fadeIn();
    }
   }
   /*
    * ------------ set up the URLs -----------------------*/

   url = $.url();
   api_server = url.param('server');

   var demoServer = "simfel.com";
   var liveServer = "communitylive.ws";

   if (typeof api_server !== 'undefined') {
    console.log("Server overriden: " + api_server);
   } else {
    api_server = liveServer;
    console.log("Server defaulting: " + api_server);
   }

   var protocol;
   if (api_server === 'localhost:8080') {
    protocol = "http://";
   } else {
    protocol = "https://";
   }

   formSubmissionURL = protocol + api_server +
    '/apptsvc/rest/authentication/loginBootStrap';
   resetPassUrl = protocol + api_server + '/apptsvc/rest/authentication/sendEmailForResetPassword?usernameOrEmail=';
   // portalExpressURL =
   // 'https://sitelettes.com/plugins/portalexpress/?server='
   // 'https://' + api_server;
   //portalExpressURL = location.origin + '/plugins/portalexpress/'+ location.search;

   portalExpressURL = location.origin + '/sitefiles/plugins/portalexpress/index.html?' + location.search + '&server=' + liveServer + 'ignorehistory=true';
   /*
    * ------------------ demo mode switch
    */
   var elem = document.querySelector('.js-switch');
   window.switcheryDemoModeSwitch = new Switchery(elem);

   $('#demo_mode_true_false_switch').change(
    function() {
     if ($(this).is(':checked')) {
      api_server_before_demo_switch = api_server;
      api_server = demoServer;
      portalExpressURL = location.origin + '/sitefiles/plugins/portalexpress/index.html?s=login&server=' + api_server;


      formSubmissionURL = protocol + api_server + '/apptsvc/rest/authentication/loginBootStrap';
      // $('#login_emailorusername').val("samfel1");
      // $('#login_password').val("community");
      // $('#login_emailorusername').change();
      // $('#login_password').change();

     } else {
      if (api_server_before_demo_switch !== 'undefined')
       api_server = api_server_before_demo_switch;
      portalExpressURL = location.origin + '/sitefiles/plugins/portalexpress/' +
       location.search;

      formSubmissionURL = protocol + api_server +
       '/apptsvc/rest/authentication/loginBootStrap';


      $('#loginForm').bootstrapValidator('resetForm', true);
     }

    });
   /*
    * END demo mode switch
    */
   $('.alert .close').on("click", function(e) {
    $(this).parent().hide();
   });

   $('#loginResultContinueButton').click(function(e) {
    // console.log("radio button clicked");
    var evt = e ? e : window.event;
    if (evt.preventDefault)
     evt.preventDefault();
    evt.returnValue = false;
    //
    showPortalExpress();
    //
    return false;

   });

   /*
    * Reset the form when hidden.
    */
   $('#loginModal').on('hide.bs.modal', function() {
    $('#loginForm').bootstrapValidator('resetForm', true);
    hidePortalExpress();
    hideLoginError();
    /*
     *
     */

    $('#demo_mode_true_false_switch').prop('checked', false);
    $('#demo_mode_true_false_switch').removeAttr('checked');
    // $('#demo_mode_true_false_switch').change();
    window.switcheryDemoModeSwitch.setPosition(false);
    $('#loginForm').bootstrapValidator('resetForm', true);
    /*
     *
     */
   });

   /*
    * attach to bootstrapvalidator events
    */
   $('#loginForm')
    .on(
     'init.field.bv',
     function(e, data) {
      // data.bv --> The BootstrapValidator
      // instance
      // data.field --> The field name
      // data.element --> The field element

      var $parent = data.element.parents('.form-group'),
       $icon = $parent
       .find('.form-control-feedback[data-bv-icon-for="' + data.field +
        '"]'),
       options = data.bv.getOptions(), // Entire
       // options
       validators = data.bv.getOptions(data.field).validators; // The

      if (validators.notEmpty && options.feedbackIcons &&
       options.feedbackIcons.required) {
       // The field uses notEmpty validator
       // Add required icon
       $icon.addClass(options.feedbackIcons.required).show();
      }
     })
    .on('shown.bs.modal', function() {
     $('#loginForm').bootstrapValidator('resetForm', true);
    })
    .bootstrapValidator({
     'resetForm': true,
     feedbackIcons: {
      required: 'glyphicon glyphicon-asterisk',
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
     },
     fields: {
      password: {
       trigger: 'change keyup',
       message: 'The password is not acceptable',
       validators: {
        notEmpty: {
         message: 'The password is required'
        },
        stringLength: {
         max: 15,
         min: 6,
         message: 'Minimum 6 characters, maximum 15.'
        }
       }
      },
      emailorusername: {
       trigger: 'change keyup',
       message: 'The email/username is not valid',
       validators: {
        notEmpty: {
         message: 'The email/username is required'
        },
        stringLength: {
         max: 40,
         message: 'Maximum 40.'
        }
       }
      },
      // end fields
     }

    })
    .on(
     'status.field.bv',
     function(e, data) {
      // Remove the required icon when the
      // field updates its status
      var $parent = data.element.parents('.form-group'),
       $icon = $parent
       .find('.form-control-feedback[data-bv-icon-for="' + data.field +
        '"]'),
       options = data.bv.getOptions(), // Entire
       // options
       validators = data.bv.getOptions(data.field).validators; // The
      // field
      // validators

      if (validators.notEmpty && options.feedbackIcons &&
       options.feedbackIcons.required) {
       $icon.removeClass(options.feedbackIcons.required).addClass(
        'glyphicon');
      }
     })
    .on(
     'success.form.bv',
     function(e) {

      // Prevent form submission
      e.preventDefault();

      // Get the form instance
      var $form = $(e.target);

      // Get the BootstrapValidator
      // instance
      var bv = $form.data('bootstrapValidator');
      $btn = $('#loginButton');
      $btn.button('loading');
      // Use Ajax to submit form data
      $
       .post(formSubmissionURL, $form.serialize(), function(result) {
        /*
         is this an owner login ?
         */
        console.log("uid: " + result.uid);
        console.log("portalExpressURL: " + portalExpressURL)
        if (typeof result !== 'undefined') {
         if (typeof result.uid !== 'undefined') {
          if (result.isOwner) {

           /*
            *
            *
            */
           $('#forgotPasswordRw').hide();
           portalExpressURL = portalExpressURL + '&UID=' + result.uid;
           /*
            * create the iframe in the ajax callback
            */

           var iFrameElement = document.createElement('iframe');
           iFrameElement.setAttribute('id', 'portalexpress_iframe');
           iFrameElement.setAttribute('src', portalExpressURL);
           iFrameElement.setAttribute('frameborder', '0');
           iFrameElement.setAttribute('width', '99.5%');
           iFrameElement.setAttribute('height', '750px');
           iFrameElement.setAttribute('style', 'overflow-y:hidden;');
           $('#portalexpress_embeddedApp').append(iFrameElement);
           console.log("src set for iframe " + portalExpressURL);
           sessionStorage.IFRM = portalExpressURL;
           showPortalExpress();
          } /* not owner */
          else {
           /* show error message for now? */
           showLoginError("Error: not an owner");
          }
         }
        } else {
         /*
          * show error
          */
        }

       }, 'json')
       .done(function() {

       })
       .fail(
        function(jqXHR, textStatus, errorThrown) {
         if (typeof jqXHR.responseJSON !== 'undefined') {
          if (typeof jqXHR.responseJSON.error !== 'undefined') {
           if (typeof jqXHR.responseJSON.error.type !== 'undefined') {
            if (jqXHR.responseJSON.error.type.toUpperCase() === 'UNABLETOCOMPLYEXCEPTION') {

             showLoginError("Error: " + jqXHR.responseJSON.error.message);
            } else if (jqXHR.responseJSON.error.type.toUpperCase() === 'PANICEXCEPTION') {

             showLoginError("Error: " + jqXHR.responseJSON.error.message);
            }
           }
          }
         } else if (typeof jqXHR.error !== 'undefined') {
          showLoginError(" " + textStatus);
         }
         $('#loginButton').prop('disabled', false);
        }).always(function() {
        console.log("finished");
        $btn = $('#loginButton');
        $btn.button('reset');
       });
     });
  });
