function getObjectSize(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
};

function parseHashBangArgs(aURL) {
	aURL = aURL || window.location.href;

	var vars = {};
	var hashes = aURL.slice(aURL.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		var hash = hashes[i].split('=');
		if (hash.length > 1) {
			vars[hash[0]] = hash[1];
		} else {
			;// vars[hash[0]] = null;
		}
	}
	return vars;
}

/*
 * detect browser and iPad
 */

var standaloneBrowser = window.navigator.standalone, userAgent = window.navigator.userAgent
  .toLowerCase(), ipad = /ipad/.test(userAgent);

if (typeof standaloneBrowser === 'undefined') {
 /* we know for sure this is not on ios and most likely standalone. */
 standaloneBrowser = true;
}

/*
 This function will parse the URL
 and produce a global object with the necessary variables which can later be
 used by other functions.
 */


function parseCommunityURL() {

 window.communityRequestProfile = {
  idDemo : false,

  isService : false,
  service : undefined,
  resetcode : undefined,
  email:undefined,
  emailverification:undefined,
  isEmailVerification:false,
  /*email verification*/
  userName:undefined,
  code:undefined,
  /* end email verification*/


  mobile:undefined,
  sa:undefined,
  sl:undefined,

  isServerSpecified : false,
  api_server : "communitylive.ws",
  protocol : "https://",

  isUidSpecified : false,
  uid : undefined

 };

 /*
  * get the URL
  */
 var url  = new URI().query(true);

 var demo =url['demo'];

 if (typeof demo !== 'undefined') {
  communityRequestProfile.isDemo = true;
 }else{
  communityRequestProfile.isDemo = false;
 }
 /*
  * determine the API server
  */
 var api_server =url['server'];
 if (typeof api_server !== 'undefined') {
  communityRequestProfile.isServerSpecified = true;
  communityRequestProfile.api_server = api_server;
 } else {
  if (communityRequestProfile.isDemo) {
   communityRequestProfile.api_server = 'simfel.com';
  } else {
   communityRequestProfile.api_server = 'communitylive.ws';
  }
  console.log("Server : " + communityRequestProfile.api_server);
 }

 var protocol;
 if (communityRequestProfile.api_server === 'localhost:8080') {
  protocol = "http://";
 } else {
  protocol = "https://";
 }
 communityRequestProfile.protocol=protocol;

 var svc=url['svc'];
 if (typeof svc !== 'undefined') {
  communityRequestProfile.isService = true;
  communityRequestProfile.service = svc;
  communityRequestProfile.resetcode = url['code'];
  communityRequestProfile.email = url['email'];

  if(svc ==='emailverification'){
   communityRequestProfile.isEmailVerification=true;
  }
  communityRequestProfile.userName = url['userName'];
  communityRequestProfile.code=   url['code'];


  communityRequestProfile.mobile = url['mobile'];
  communityRequestProfile.sa = url['sa'];
  communityRequestProfile.sl = url['sl'];


 }

 var uid =url['UID'];
 if (typeof uid !== 'undefined') {
  communityRequestProfile.isUidSpecified = true;
  communityRequestProfile.uid = uid;
 }
 var uri=new URI();
 var friendlyURL=uri.pathname(); /* directory does not work with localhost */
 if(typeof friendlyURL !=='undefined'){
   communityRequestProfile.friendlyURL=friendlyURL.slice(1)
 }
 /* save the global */
 window.communityRequestProfile = communityRequestProfile;

}

function processAjaxError(jqXHR) {
 var extractedErrorMessage = "Error encountered";
 var str = jqXHR.responseText;
 /*
  * hack, detect service outage
  */
 if ((str === "")) {
  /*
   * most likely no service
   */
  str = '{"error":{"type":"unabletocomplyexception","message":"Unable to reach service. Please try later."}}';
 }

 /*
  * end hack
  */

 str = str.replace(/^"?(.+?)"?$/, '$1');
 var responseTextObject = JSON.parse(str);

 if (typeof jqXHR.responseText !== 'undefined') {
  if (typeof responseTextObject.error !== 'undefined') {
   if (typeof responseTextObject.error.type !== 'undefined') {
    if (responseTextObject.error.type.toUpperCase() === 'UNABLETOCOMPLYEXCEPTION') {

     extractedErrorMessage = responseTextObject.error.message;

    } else if (responseTextObject.error.type.toUpperCase() === 'PANICEXCEPTION') {
     extractedErrorMessage = responseTextObject.error.message;
    }
   }
  }
 } else {
  extractedErrorMessage = "Error encountered: " + str;
 }

 return extractedErrorMessage;
}

var  openCustomURLinIFrame = function(src) {

 var iframe = document.createElement("IFRAME");
 iframe.setAttribute("src", src);
 document.documentElement.appendChild(iframe);
 iframe.parentNode.removeChild(iframe);
 iframe = null;
 console.log("Called back IOS with src="+src);
};

/*
 * for communication with the IOS Portal
 */
var sendToApp = function(_key, _val) {
  var src=  _key + ":##sendToApp##" + _val;
  openCustomURLinIFrame(src);
};



function createPortalExpressInRow($portalExpressRow, src) {
 var iFrameElement = document.createElement('iframe');
 iFrameElement.setAttribute('id', 'portalExpressIframe');
 iFrameElement.setAttribute('src', src);
 iFrameElement.setAttribute('width', '99.6%');
 iFrameElement.setAttribute('height', '750px');
 iFrameElement.setAttribute('frameborder', '0');
 //$('#portalExpressRow').html('');
 setTimeout(function(){ $portalExpressRow.html(iFrameElement); }, 2000);


}
