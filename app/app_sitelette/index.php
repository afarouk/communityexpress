<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once ('sitefiles/php/Mobile_Detect.php');
include_once ('sitefiles/php/parser_api_utility.php');
include_once ('sitefiles/php/detecturl.php');

$tileViewDetails = false;
/*is demo=true */

if (validateParams('demo')) {
  $demo = true;
} else {
  $demo = false;
}

$detect = new Mobile_Detect();
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

if (strpos($serverName, 'localhost') !== false) {
  $protocol = 'http://';
} else {
  $protocol = 'https://';
}

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
  /* hack */
  if($friendlyURL==='signup' ||
     $friendlyURL==='about'  ||
     $friendlyURL==='features' ||
     $friendlyURL==='portalexpress' || 
     $friendlyURL==='apiLicensing' ||
     $friendlyURL==='developer' ||
     $friendlyURL==='common_senddemo.php'
    )
     $friendlyURL=null;
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
  echo '$desktopIFrame=' . $desktopIFrame . '</br>';
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

if ($saslAccess || $urlKeyAccess) {
  if ( (!$detect->isMobile() || $detect->isTablet()) && !$desktopIFrame) {
    include_once ('common_desktop.php');
  } else {
    $errorMessage = null;
    $saslName = null;
    $appleTouchIcon60URL = null;
    $isPrivate = false;
    $canCreateAnonymousUser = false;
    if ($urlKeyAccess) {
      $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveSiteletteByURLkey?UID=&latitude=&longitude=&urlKey=' . $friendlyURL . '&tileViewDetails=' . ($tileViewDetails ? 'true' : 'false');
    } else {
      $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveSiteletteBySASL?UID=&latitude=&longitude=&serviceAccommodatorId=' . $serviceAccommodatorId . '&serviceLocationId=' . $serviceLocationId . '&tileViewDetails=' . ($tileViewDetails ? 'true' : 'false');
    }

    $siteletteJSON = makeApiCall($apiURL);
    if ($siteletteJSON['curl_error']) {
      $errorMessage = $siteletteJSON['curl_error'];
      $errorMessage = 'Service unavailable.';
      include_once 'error_page/index.php';
    } else {
      if (isset($siteletteJSON['error'])) {
        $errorMessage = $siteletteJSON['error']['message'];
        include_once 'error_page/index.php';

      } else {
        $saslJSON = json_decode($siteletteJSON['saslJSON'], true);
        $themeId = $saslJSON['themeId'];
        $domain = $saslJSON['domainEnum'];
        $themeCSS = 'styles.css';
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
        include_once 'sitelette.php';
      } /*end valid sitelette*/
    } /*end can reach server */
  }
} else {
  /*
  * neither sasl access or urlkey access.
  * neither URL nor sa,sl provided
  */
  include_once 'common_chalkboards.php';
} /* end no url supplied*/
