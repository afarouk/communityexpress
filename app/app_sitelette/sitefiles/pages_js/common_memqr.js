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


    if (window.communityRequestProfile.iid !== 'undefined') {
      console.log("Detected iid : " + window.communityRequestProfile.iid);

      /*
        SERVER HACK, for demo keytag numbers
      */
      if (100 < window.communityRequestProfile.iid < 1000) {
        if (window.communityRequestProfile.api_server === 'communitylive.ws') {
          window.communityRequestProfile.api_server = 'simfel.com';
          console.log(" detected demo keytag, switching server to simfel");
        }
      }
      $("#banner_anchor").attr("href", "/memqr?iid=" + window.communityRequestProfile.iid);
    } else {
      console.log("iid is undefined");
       return;
    }

    $("#memqr_login_button").unbind("click").bind("click", function(e) {
      e.preventDefault();

      console.log("this is Overridden click event!");
    });

    //  $("#memqr_user_data").hide();

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
    var adhocEntry;
    var adhocEntryCookie = getCookie('cmxAdhocEntry');
    console.log("adhocEntryCookie: " + adhocEntryCookie);
    if (adhocEntryCookie === 'true' || adhocEntryCookie == true) {
      adhocEntry = true;
    } else {
      adhocEntry = false;
    }
    window.communityRequestProfile.adhocEntry = adhocEntry;
    console.log("Current adhocEntry: " + adhocEntry);


    window.communityRequestProfile.uid = getCookie('cmxUID');

    /* resolve iid to uid */
    console.log("uid: " + window.communityRequestProfile.uid);

    console.log("Server: " + window.communityRequestProfile.api_server);

    var restURL = window.communityRequestProfile.protocol + window.communityRequestProfile.api_server + "/apptsvc/rest/usersasl/retrieveUserAndSASLsByKUID"
    console.log(restURL);

    var postData = JSON.stringify({
      iid: window.communityRequestProfile.iid,
      adhoc: window.communityRequestProfile.adhocEntry,
      uid: window.communityRequestProfile.uid
    });

    $.ajax({
      url: restURL,
      type: 'POST',
      data: postData,
      contentType: "application/json; charset=utf-8"
    }).done(function(userAndSASLs) {
      console.log("userAndSASLs :" + userAndSASLs);
      if (typeof userAndSASLs.userRegistrationDetails.uid !== 'undefined') {
        /* got user */
        window.communityRequestProfile.userRegistrationDetails = userAndSASLs.userRegistrationDetails;
        //$('.qrcode' img).attr('src',userRegistrationDetails.)




        console.log("Current adhocEntry:" + window.communityRequestProfile.adhocEntry);

        var currentCookie = getCookie('cmxUID');
        console.log(" Current  UID=" + currentCookie);
        if (currentCookie === userAndSASLs.userRegistrationDetails.uid) {
          console.log("cookie matched");
        } else {
          console.log("cookies don't match");
        }
        /*
         * save it in localstorage
         *
         */
        console.log(" saving to local storage cmxUID:" +
          userAndSASLs.userRegistrationDetails.uid);
        localStorage.setItem("cmxUID", userAndSASLs.userRegistrationDetails.uid);

        setCookie('cmxUID', userAndSASLs.userRegistrationDetails.uid, 365);

        var boolCookie = (userAndSASLs.userRegistrationDetails.adhocEntry ? 'true' : 'false');
        setCookie('cmxAdhocEntry', boolCookie, 365);

        /* echo check */
        var adhocEntry;
        var adhocEntryCookie = getCookie('cmxAdhocEntry');
        if (adhocEntryCookie === 'true') {
          adhocEntry = true;
        } else {
          adhocEntry = false;
        }
        console.log("Echo check: userSASLs.qrCodeURL:" + userAndSASLs.qrCodeURL);

        $('#qrcode_img').attr('src', userAndSASLs.qrCodeURL);
        if (userAndSASLs.sitelettes !== 'undefined') {


          for (i = 0; i < userAndSASLs.sitelettes.length; i++) {
            var bannerImageURL = userAndSASLs.sitelettes[i].bannerImageURL;
            bannerImageURL = bannerImageURL.replace('http://', 'https://')

            var siteURL = userAndSASLs.sitelettes[i].siteURL;
            siteURL = siteURL.replace('http://', 'https://')
            if (siteURL.indexOf("?demo") >= 0) {
              siteURL = siteURL.concat('&UID=', userAndSASLs.userRegistrationDetails.uid);
            } else {
              siteURL = siteURL.concat('?UID=', userAndSASLs.userRegistrationDetails.uid);
            }
            console.log(" Sitelette: " + bannerImageURL);
            console.log(" siteURL: " + siteURL);


            $('<img />').attr({
              src: bannerImageURL
            }).appendTo($('<a />').attr({
              href: siteURL
            }).appendTo($('<li />').attr({

            }).appendTo($("#saslListUL"))));




          }
        }
      }

    }).fail(function(jqXHR, textStatus, errorThrown) {
      var message = processAjaxError(jqXHR);
      var success = false;
      console.log("Error:" + message);

    }).always(function() {

    });



  });
