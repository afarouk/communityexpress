var filter = [];

//since we're looking for phone numbers, we need
//to allow digits 0 - 9 (they can come from either
//the numeric keys or the numpad)
const keypadZero = 48;
const numpadZero = 96;

//add key codes for digits 0 - 9 into this filter
for(var i = 0; i <= 9; i++){
  filter.push(i + keypadZero);
  filter.push(i + numpadZero);
}

//add other keys that might be needed for navigation
//or for editing the keyboard input
filter.push(8);     //backspace
filter.push(9);     //tab
filter.push(46);    //delete
filter.push(37);    //left arrow
filter.push(39);    //right arrow

/*******************************************************
  * onKeyDown(e)
  * when a key is pressed down, check if it is allowed
  * or not. If not allowed, prevent the key event
  * from propagating further
*******************************************************/
function onKeyDown(e){
  if(filter.indexOf(e.keyCode) < 0){
    e.preventDefault();
    return false;
  }
}
/*******************************************************
  * formatPhoneText
  * returns a string that is in XXX-XXX-XXXX format
*******************************************************/
function formatPhoneText(value){
  value = this.replaceAll(value.trim(),"-","");

  if(value.length > 3 && value.length <= 6)
    value = value.slice(0,3) + "-" + value.slice(3);
  else if(value.length > 6)
    value = value.slice(0,3) + "-" + value.slice(3,6) + "-" + value.slice(6);

  return value;
}
/*******************************************************
  * validatePhone
  * return true if the string 'p' is a valid phone
*******************************************************/
function validatePhone(p){
  var phoneRe = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
  var digits = p.replace(/\D/g, "");
  return phoneRe.test(digits);
}

/*******************************************************
  * onKeyUp(e)
  * when a key is pressed up, grab the contents in that
  * input field, format them in line with XXX-XXX-XXXX
  * format and validate if the text is infact a complete
  * phone number. Adjust the border color based on the
  * result of that validation
*******************************************************/
function onKeyUp(e){
  var input = e.target;
  var formatted = formatPhoneText(input.value);
  var isError = (validatePhone(formatted) || formatted.length == 0);
  var color =  (isError) ? "gray" : "red";
  var borderWidth =  (isError)? "1px" : "3px";
  input.style.borderColor = color;
  input.style.borderWidth = borderWidth;
  input.value = formatted;
}

/*******************************************************
  * setupPhoneFields
  * Now let's rig up all the fields with the specified
  * 'className' to work like phone number input fields
*******************************************************/
function setupPhoneFields(className){
  var lstPhoneFields = document.getElementsByClassName(className);

  for(var i=0; i < lstPhoneFields.length; i++){
    var input = lstPhoneFields[i];
    if(input.type.toLowerCase() == "text"){
      input.placeholder = "Enter a phone (XXX-XXX-XXXX)";
      input.addEventListener("keydown", onKeyDown);
      input.addEventListener("keyup", onKeyUp);
    }
  }
}


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
  setupPhoneFields("phoneNumber");

  function() {
    /*
    parse url etc.
    */
    parseCommunityURL();

    /*
    SERVER HACK, for demo keytag numbers

    */
    if(window.communityRequestProfile.iid!=='undefined'){
      console.log("Detected iid : " + window.communityRequestProfile.iid);

      if(100<window.communityRequestProfile.iid<199){
        if(window.communityRequestProfile.api_server==='communitylive.ws'){
          window.communityRequestProfile.api_server='simfel.com';
          console.log(" detected demo keytag, switching server to simfel");
        }
      }
    }else{
      console.log("iid is undefined");
      return;
    }


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
