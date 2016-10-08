<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once ('sitefiles/php/Mobile_Detect.php');
include_once ('sitefiles/php/parser_api_utility.php');
include_once ('sitefiles/php/detecturl.php');

$tileViewDetails = false;
$useTemplate=true;
/*is demo=true */


$detect = new Mobile_Detect;
$iPhoneVersion=$detect->version('iPhone'); // 3.1 (float)
if ($iPhoneVersion){
  $IOSversion= intval( substr($iPhoneVersion, 0, strpos($iPhoneVersion, '_')));
  if($IOSversion >= 10){
    $videoNeedsPlaceholder=false;
  }else{
    $videoNeedsPlaceholder=true;
  }
}
else {
  $videoNeedsPlaceholder=false;
}


if (validateParams('demo')) {
  $demo = true;
} else {
  $demo = false;
}

/* is desktopiframe=true
*
* if this is true, we load normally even when we detect
* desktop. This means the iframe src will not try to load
* the desktop wrapper and thus prevent a re-entrant loop*/

if (validateParams('desktopiframe')) {
  $desktopIFrame = true;
} else {
  $desktopIFrame = false;
}

$completeURL = full_url($_SERVER, true);
$serverName = $_SERVER['SERVER_NAME'];
/* determine the http host */



/* is API server specified? */

if (validateParams('server')) {
  $server = $_REQUEST['server'];
  if (strcmp($server, 'localhost') === 0) {
    $server = $server . ':8080';
  }
} else {
  if ($demo) {
    $server = 'simfel.com';
  } else {
    $server = 'communitylive.ws';
  }
}

if (strpos($server, 'localhost') !== false) {
  $protocol = 'http://';
} else {
  $protocol = 'https://';
}

/* is IOS embedded specified?*/

if (validateParams('embedded')) {
  $embedded = true;
} else {
  $embedded = false;
}

/* is serviceAccomodatorId specified (only from Portal) */

if (validateParams('serviceAccommodatorId')) {
  $serviceAccommodatorId = $_REQUEST['serviceAccommodatorId'];
} else {
  $serviceAccommodatorId = null;
}

if (validateParams('serviceLocationId')) {
  $serviceLocationId = $_REQUEST['serviceLocationId'];
} else {
  $serviceLocationId = null;
}

if (validateParams('friendlyURL')) {
  $friendlyURL = $_REQUEST['friendlyURL'];
  if(isset($friendlyURL)){
    switch($friendlyURL){
      case 'privacypolicy':
       $pageAccess='common_privacypolicy.php';
       break;
      case 'termsandconditions':
       $pageAccess='common_termsandconditions.php';
       break;
      case 'about':
       $pageAccess='common_about.php';
       break;
      case 'apiLicensing':
       $pageAccess='common_apiLicensing.php';
       break;
      case 'developer':
       $pageAccess='common_developer.php';
       break;
      case 'sendsample':
        $pageAccess='common_sendsample.php';
       break;
      case 'resetpassword':
       $pageAccess='common_resetpassword.php';
      break;
      case 'sendsample':
       $pageAccess='common_sendsample.php';
       break;
      case 'template':
       $pageAccess='common_template.php';
       break;
      case 'unsubscribe':
        $pageAccess='common_unsubscribe.php';
        break;
      case 'portalexpress':
        $pageAccess='common_portalexpress.php';
        break;



      default:
    }
  }
} else {
  $friendlyURL = null;
}

if (validateParams('UID')) {
  $UID = $_REQUEST['UID'];
} else {
  $UID = null;
}

if (validateParams('t')) {
  $type = $_REQUEST['t'];
} else {
  $type = null;
}

if (validateParams('u')) {
  $uuidURL = $_REQUEST['u'];
} else {
  $uuidURL = null;
}

if (validateParams('street')) {
  $street = $_REQUEST['street'];
} else {
  $street = null;
}

if (validateParams('city')) {
  $city = $_REQUEST['city'];
} else {
  $city = null;
}

if (validateParams('number')) {
  $number = $_REQUEST['number'];
} else {
  $number = null;
}

if ((!is_null($city)) || (!is_null($street)) || (!is_null($number))) {
    $hasAddress = true;
} else {
    $hasAddress = false;
}

if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
  $saslAccess = true;
} else {
  $saslAccess = false;
}

if (!is_null($friendlyURL)) {
  $urlKeyAccess = true;
} else {
  $urlKeyAccess = false;
}

if (validateParams('ftl')) {
  $ftlfile = $_REQUEST['ftl'];
}else {
  $ftlfile = null;
}

  $og_type="article";
  $og_title="Chalkboards Title";
  $og_description="Chalkboards Description";
  $og_image=null;//$protocol.$server."/apptsvc/rest/media/retrieveStaticMedia/pree/default.jpg";
  /* Twitter related */
  $twitter_card="summary_large_image";
  $twitter_site="@Chalkboards";
  $twitter_title=  $og_title;
  $twitter_description=$og_description;
  $twitter_image=$og_image;

  $detectedShare=false;

  if( $detectedShare ){
    /* depending on the type, make the api call, get the details
       and update the og tags */

    $apiURL = $protocol . $server . "/apptsvc/rest/pree/retrieveQuestion?contestUUID=".$uuidURL;
    $questionJSON = makeApiCall($apiURL);
    if ($questionJSON['curl_error']) {
     $errorMessage = $siteletteJSON['curl_error'];
     $errorMessage = 'Service unavailable.';
    } else if (isset($questionJSON['error'])) {
      $errorMessage = $questionJSON['error']['message'];
    } else {
      /* change meta data based on question */

      $og_title=$questionJSON['ogTitle'];
      $og_description=$questionJSON['ogDescription'];
      $og_image =$questionJSON['ogImage'];

      $twitter_title=  $og_title;
      $twitter_description=$og_description;
      $twitter_image=$og_image;
    }
  }


/* NOTE: if debug=true then PHP will echo variables and exit */

if (validateParams('debug')) {
  echo '$completeURL=' . $completeURL . '</br>';
  echo '$serverName=' . $serverName . '</br>';
  echo '$friendlyURL=' . $friendlyURL . '</br>';
  echo '$server=' . $server . '</br>';
  echo '$embedded=' . ($embedded ? 'true' : 'false') . '</br>';
  echo '$demo=' . ($demo ? 'true' : 'false') . '</br>';
  echo '$serviceAccommodatorId=' . $serviceAccommodatorId . '</br>';
  echo '$serviceLocationId=' . $serviceLocationId . '</br>';
  echo '$UID=' . $UID . '</br>';
  echo '$saslAccess=' . ($saslAccess ? 'true' : 'false') . '</br>';
  echo '$urlKeyAccess=' . ($urlKeyAccess ? 'true' : 'false') . '</br>';
  echo '$desktopIFrame=' . ($desktopIFrame ? 'true' : 'false')  . '</br>';
  if(isset($IOSversion)){
    echo '$IOSversion=' . $IOSversion . '</br>';
  }
  echo '$videoNeedsPlaceholder=' . ($videoNeedsPlaceholder ? 'true' : 'false')  . '</br>';
  echo '$city=' . $city . '</br>';
  echo '$street=' . $street . '</br>';
  echo '$number=' . $number . '</br>';
  if (!is_null($friendlyURL)) {
    echo '$friendlyURL is ' . $friendlyURL . '</br>';
  }  elseif ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
    echo '$serviceAccommodatorId is ' . $serviceAccommodatorId . ' and $serviceLocationId is ' . $serviceLocationId;
  }  else {
    echo ' root case ';
  }

  return;
}

// not mobile or tablet and not already in the iframe
if(isset($pageAccess)){
  include_once('sitefiles/pages/'.$pageAccess);
} else if ($saslAccess || $urlKeyAccess) {
  if ( (!$detect->isMobile() || $detect->isTablet()) && !$desktopIFrame) {
    include_once ('sitefiles/pages/'.'common_desktop.php');
  } else {
    $errorMessage = null;
    $saslName = null;
    $appleTouchIcon60URL = null;
    $isPrivate = false;
    $canCreateAnonymousUser = false;
    if ($urlKeyAccess) {
      $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveSiteletteByURLkeyAndTemplate?UID=&latitude=&longitude=&urlKey=' . $friendlyURL . '&tileViewDetails=' . ($tileViewDetails ? 'true' : 'false').'&videoNeedsPlaceholder='.($videoNeedsPlaceholder ?'true':'false').'&ftl='.$ftlfile;
    } else {
      $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveSiteletteBySASLandTemplate?UID=&latitude=&longitude=&serviceAccommodatorId=' . $serviceAccommodatorId . '&serviceLocationId=' . $serviceLocationId . '&tileViewDetails=' . ($tileViewDetails ? 'true' : 'false').'&videoNeedsPlaceholder='.($videoNeedsPlaceholder ?'true':'false').'&ftl='.$ftlfile;
    }

    $siteletteJSON = makeApiCall($apiURL);
    if ($siteletteJSON['curl_error']) {
      $errorMessage = 'Service unavailable: '.$siteletteJSON['curl_error'];
      include_once ('error_page/index.php');
    } else {
      if (isset($siteletteJSON['error'])) {
        $errorMessage = 'Service unavailable: '.$siteletteJSON['error']['message'];
        include_once ('error_page/index.php');

      } else {
        $saslJSON = json_decode($siteletteJSON['saslJSON'], true);
        $themeId = $saslJSON['themeId'];
        $domain = $saslJSON['domainEnum'];
        $serviceAccommodatorId = $saslJSON['serviceAccommodatorId'];
        $serviceLocationId = $saslJSON['serviceLocationId'];
        $saslName = $saslJSON['saslName'];
        $appleTouchIcon60URL = $saslJSON['appleTouchIcon60URL'];
        $androidHomeScreenIconURL = $saslJSON['androidHomeScreenIconURL'];
        if (is_null($friendlyURL)) {
          if (array_key_exists('anchorURL', $saslJSON)) {
            $anchorURL = $saslJSON['anchorURL'];
            if (array_key_exists('friendlyURL', $anchorURL)) {
              $friendlyURL = $anchorURL['friendlyURL'];
            } else {
              $friendlyURL = null;
            }
          } else {
            $friendlyURL = null;
          }
        }
        $og_title="Some Title ";
        $og_description="Some Description";
        $og_image="Some image url";

        $twitter_card="Some Twitter card";
        $twitter_site="Some twitter site url";
        $twitter_title=" Some title";
        $twitter_description="Some description";
        $twitter_image="Some image url";


       include_once 'themes/1/head.php';
       if($useTemplate){
         echo $siteletteJSON['landingViewHTML'];
       }else{
         include_once 'themes/1/body.html';
       }
       echo '</html>';
      } /*end valid sitelette*/
    } /*end can reach server */
  }
} else {
  /*
  * neither sasl access or urlkey access.
  * neither URL nor sa,sl provided
  */
  include_once ('sitefiles/pages/'.'common_chalkboards.php');
} /* end no url supplied*/
