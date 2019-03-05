/*
cookie related functions
*/
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}


$(document).ready(
  //MAIN

  function() {

    var cleave = new Cleave('.input-phone', {
      phone: true,
      phoneRegionCode: 'US'
    });
    /*
    parse url etc.
    */
    parseCommunityURL();

    /*
    SERVER HACK, for demo keytag numbers

    */
    if(window.communityRequestProfile.iid!=='undefined'){
      console.log("Detected iid : " + window.communityRequestProfile.iid);
      $("#memqr_echo_check").text(" Echo check "+window.communityRequestProfile.iid);

      if(100<window.communityRequestProfile.iid<199){
        if(window.communityRequestProfile.api_server==='communitylive.ws'){
          window.communityRequestProfile.api_server='simfel.com';
          console.log(" detected demo keytag, switching server to simfel");
        }
      }
    }else{
      console.log("iid is undefined");
      $("#memqr_echo_check").text(" Echo check NO iid");
      return;
    }

    $("#memqr_user_data").hide();

    /*
    END SERVER HACK
    */
    /* bind function to login button */
    /*
    $("#memqr_login_anchor").click(function(e) {
      e.preventDefault();

      alert("iid=" + window.communityRequestProfile.iid);
    });
    */

    /* resolve iid to uid */

    console.log("Server: " + window.communityRequestProfile.api_server);

    var restURL = window.communityRequestProfile.protocol + window.communityRequestProfile.api_server + "/apptsvc/rest/authentication/retrieveOrCreateUserByKUID"
    console.log(restURL);

    var postData = JSON.stringify({
      kUID: window.communityRequestProfile.iid
    });

    $.ajax({
      url: restURL,
      type: 'POST',
      data: postData,
      contentType: "application/json; charset=utf-8"
    }).done(function(userRegistrationDetails) {
      console.log("userRegistrationDetails :" + userRegistrationDetails);
      if (typeof userRegistrationDetails.uid !== 'undefined') {

        /*
         * save it in localstorage
         *
         */
        console.log(" saving to local storage cmxUID:" +
          userRegistrationDetails.uid);
        localStorage.setItem("cmxUID", userRegistrationDetails.uid);
        setCookie('cmxUID', userRegistrationDetails.uid, 365);


        var boolCookie = (userRegistrationDetails.adhocEntry ? 'true' : 'false');
        console.log(" saving to local storage cmxAdhocEntry:" +
          boolCookie);
        setCookie('cmxAdhocEntry', boolCookie, 365);
        //Cookies.set('cmxUID',userRegistrationDetails.uid , {expires:365});
        //this.setUser(userRegistrationDetails.uid, userRegistrationDetails.userName);

        /* echo check */
        var adhocEntry;
        var adhocEntryCookie = getCookie('cmxAdhocEntry');
        if (adhocEntryCookie === 'true') {
          adhocEntry = true;
        } else {
          adhocEntry = false;
        }
        console.log("Echo check: adhocEntry:"+adhocEntry);

      }

    }).fail(function(jqXHR, textStatus, errorThrown) {
      var message = processAjaxError(jqXHR);
      var success = false;
      console.log("Error:" + message);
      /*
       *
       */
    }).always(function() {
      /* ladda_submit_mobile_button.stop(); */
    });



  });
