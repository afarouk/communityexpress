<?php
include_once('sitefiles/php/Mobile_Detect.php');
include_once('sitefiles/php/parser_api_utility.php');
include_once('sitefiles/php/detecturl.php');

$tileViewDetails = false;
$useTemplate     = true;

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

$detect        = new Mobile_Detect;
$iPhoneVersion = $detect->version('iPhone'); // 3.1 (float)
if ($iPhoneVersion) {
    $IOSversion = intval(substr($iPhoneVersion, 0, strpos($iPhoneVersion, '_')));
    if ($IOSversion >= 10) {
        $videoNeedsPlaceholder = false;
    } else {
        $videoNeedsPlaceholder = true;
    }
} else {
    $videoNeedsPlaceholder = false;
}

if ((!$detect->isMobile() && !$detect->isTablet()) && !$desktopIFrame) {
    $isDesktop=true;
    $userAgent='d';
} else {
    $isDesktop=false;
    $userAgent='m';
}

if (validateParams('demo')) {
    $demo = true;
} else {
    $demo = false;
}



$completeURL = full_url($_SERVER, true);
$serverName  = $_SERVER['SERVER_NAME'];
/* determine the http host */

/* temporary facebook appId by is production or not */
/* facebook logout won't work on localhost probably */
$FacebookAppId = '793067554198873';
if ($serverName === 'chalkboardstoday.com') {
    $FacebookAppId = '325638451175132';
}
/*  ...  */

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
    if (isset($friendlyURL)) {
        switch ($friendlyURL) {
      case 'embedded_userguide':
            $pageAccess = 'embedded_userguide.php';
        break;
      case 'userguide':
        $pageAccess = 'common_userguide.php';
        break;
      case 'privacypolicy':
        $pageAccess = 'common_privacypolicy.php';
        break;
      case 'termsandconditions':
        $pageAccess = 'common_termsandconditions.php';
        break;
      case 'about':
        $pageAccess = 'common_about.php';
        break;
      case 'apiLicensing':
        $pageAccess = 'common_apiLicensing.php';
        break;
      case 'developer':
        $pageAccess = 'common_developer.php';
        break;
      case 'sendsample':
        $pageAccess = 'common_sendsample.php';
        break;
      case 'resetpassword':
        $pageAccess = 'common_resetpassword.php';
        break;
      case 'sendsample':
        $pageAccess = 'common_sendsample.php';
        break;
      case 'template':
        $pageAccess = 'common_template.php';
        break;
      case 'unsubscribe':
        $pageAccess = 'common_unsubscribe.php';
        break;
      case 'portalexpress':
        $pageAccess = 'common_portalexpress.php';
        break;
      case 'signup':
        $pageAccess = 'common_signup.php';
        break;
      case 'testflyer':
        $pageAccess = 'common_testflyer.php';
        break;
      case 'themeoption':
        $pageAccess = 'common_themeoption.php';
        break;
      case 'support':
          $pageAccess = 'common_support.php';
          break;
	 case 'Pricing':
          $pageAccess = 'common_pricing.php';
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

if (validateParams('fullCode')) {
    $fullCode = $_REQUEST['fullCode'];
} else {
    $fullCode = null;
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

if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId)) && !isset($pageAccess)) {
    $saslAccess = true;
} else {
    $saslAccess = false;
}

if (!is_null($friendlyURL) && !isset($pageAccess)) {
    $urlKeyAccess = true;
} else {
    $urlKeyAccess = false;
}

if (validateParams('ftl')) {
    $ftlfile = $_REQUEST['ftl'];
} else {
    $ftlfile = null;
}

$canCreateAnonymousUser=false;
if ($saslAccess || $urlKeyAccess) {
    $errorMessage           = null;
    $saslName               = null;
    $appleTouchIcon60URL    = null;
    $isPrivate              = false;
    if ($urlKeyAccess) {
        $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveSiteletteByURLkeyAndTemplate?UID=&latitude=&longitude=&urlKey=' . $friendlyURL . '&tileViewDetails=' . ($tileViewDetails ? 'true' : 'false') . '&videoNeedsPlaceholder=' . ($videoNeedsPlaceholder ? 'true' : 'false').'&ua='.$userAgent. '&ftl=' . $ftlfile;
    } else {
        $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveSiteletteBySASLandTemplate?UID=&latitude=&longitude=&serviceAccommodatorId=' . $serviceAccommodatorId . '&serviceLocationId=' . $serviceLocationId . '&tileViewDetails=' . ($tileViewDetails ? 'true' : 'false') . '&videoNeedsPlaceholder=' . ($videoNeedsPlaceholder ? 'true' : 'false') .'&ua='.$userAgent. '&ftl=' . $ftlfile;
    }

    $siteletteJSON = makeApiCall($apiURL);
    if ($siteletteJSON['curl_error']) {
        $errorMessage = 'Service unavailable: ' . $siteletteJSON['curl_error'];
    } else {
        if (isset($siteletteJSON['error'])) {
            $errorMessage = 'Service unavailable: ' . $siteletteJSON['error']['message'];
        } else {
            $saslJSON                 = json_decode($siteletteJSON['saslJSON'], true);
            $themeId                  = $saslJSON['themeId'];
            $barFontColors            = $saslJSON['themeColors']['barFontColors'];
            $domain                   = $saslJSON['domainEnum'];
            $serviceAccommodatorId    = $saslJSON['serviceAccommodatorId'];
            $serviceLocationId        = $saslJSON['serviceLocationId'];
            $saslName                 = $saslJSON['saslName'];
            $appleTouchIcon60URL      = $saslJSON['appleTouchIcon60URL'];
            $androidHomeScreenIconURL = $saslJSON['androidHomeScreenIconURL'];
            $canCreateAnonymousUser   = $saslJSON['canCreateAnonymousUser'];;

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

            if (is_null($type)) {
                $og_title       = $saslJSON['ogTags']['title'];
                $og_description = $saslJSON['ogTags']['description'];
                $og_image       = $saslJSON['ogTags']['image'];
                $og_url         = remove_querystring_var($completeURL, 'desktopiframe');
            } else {
                /* make api call */
        $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveOgTags?type=' . $type . '&uuid=' . $uuidURL;

                $ogTags = makeApiCall($apiURL);

                $og_title       = $ogTags['title'];
                $og_description = $ogTags['description'];
                $og_image       = $ogTags['image'];
                $og_url         = $completeURL;
            }

            $twitter_card = "summary_large_image";
            $twitter_site = "@ChalkboardsToday";

            $twitter_title       = $og_title;
            $twitter_description = $og_description;
            $twitter_image       = $og_image;
            $twitter_url         = $og_url;
        }
    /*end valid sitelette*/
    }
  /*end can reach server */
} else {
    $errorMessage           = null;
    $showSASLTiles          =false;
    $apiURL = $protocol . $server . '/apptsvc/rest/html/retrieveSASLTilesByUIDAndLocation?UID=&latitude=&longitude=&ua='.$userAgent. '&ftl=' . $ftlfile;

    $saslTiles = makeApiCall($apiURL);
    if ($saslTiles['curl_error']) {
        $errorMessage = 'Service unavailable: ' . $saslTiles['curl_error'];
    } else {
        if (isset($saslTiles['error'])) {
            $errorMessage = 'Service unavailable: ' . $saslTiles['error']['message'];
        } else {
            $showSASLTiles            = $saslTiles['showSASLTiles'];
            $saslTilesJSON            = json_decode($saslTiles['saslTilesJSON'], true);
            $saslTilesHTML            = $saslTiles['saslTilesHTML'];
        }
    /*end no error*/
    }
  /*end can reach server */
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
    echo '$desktopIFrame=' . ($desktopIFrame ? 'true' : 'false') . '</br>';
    if (isset($IOSversion)) {
        echo '$IOSversion=' . $IOSversion . '</br>';
    }
    echo '$videoNeedsPlaceholder=' . ($videoNeedsPlaceholder ? 'true' : 'false') . '</br>';
    echo '$city=' . $city . '</br>';
    echo '$street=' . $street . '</br>';
    echo '$number=' . $number . '</br>';
    if (!is_null($friendlyURL)) {
        echo '$friendlyURL is ' . $friendlyURL . '</br>';
    } elseif ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
        echo '$serviceAccommodatorId is ' . $serviceAccommodatorId . ' and $serviceLocationId is ' . $serviceLocationId.'</br>';
    } else {
        echo ' root case </br>';
    }
    if ($isDesktop) {
        echo 'Desktop detected </br>';
    } else {
        echo 'Mobile detected </br>';
    }
    if (!is_null($type)) {
        echo ' $og_title:'.$og_title.'</br>';
        echo ' $og_description:'.$og_description.'</br>';
        ;
        echo ' $og_image:'.$og_image.'</br>';
    }

    echo '$showSASLTiles='.$showSASLTiles . '</br>';
    echo '$saslTilesJSON='.$saslTilesJSON . '</br>';
    echo '$saslTilesHTML='.$saslTilesHTML . '</br>';

    exit();
}
