<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once ('Mobile_Detect.php');
include_once ('parser_api_utility.php');

$detect = new Mobile_Detect;
/* is desktopiframe=true
 *
 * if this is true, we load normally even when we detect
 * desktop. This means the iframe src will not try to load
 * the desktop wrapper and thus prevent a re-entrant loop*/
if (validateParams('desktopiframe')) {
 $desktopIFrame = TRUE;
} else {
 $desktopIFrame = FALSE;
}

// not mobile or tablet and not already in the iframe
if ((!$detect -> isMobile() || $detect -> isTablet()) && !$desktopIFrame) {

 include_once ('desktop_index.php');

} else {

 $completeURL = full_url($_SERVER, true);
 $serverName = $_SERVER['SERVER_NAME'];
 /* determine the http host */
 if (strpos($serverName, 'localhost') !== false) {
  $protocol = 'http://';
 } else {
  $protocol = 'https://';
 }
 /*is demo=true */
 if (validateParams('demo')) {
  $demo = TRUE;
 } else {
  $demo = FALSE;
 }

 /* is API server specified? */
 if (validateParams('server')) {
  $server = $_REQUEST['server'];
  if (strcmp($server, 'localhost') === 0)
   $server = $server . ':8080';
 } else {
  if ($demo) {
   $server = "chalkboardsdemo.dev";
  } else {
   $server = "communitylive.ws";
  }
 }

 /* is IOS embedded specified?*/
 if (validateParams('embedded')) {
  $embedded = TRUE;
 } else {
  $embedded = FALSE;
 }

 /* is serviceAccomodatorId specified (only from Portal) */
 if (validateParams('serviceAccommodatorId')) {
  $serviceAccommodatorId = $_REQUEST['serviceAccommodatorId'];
 } else {
  $serviceAccommodatorId = NULL;
 }

 if (validateParams('serviceLocationId')) {
  $serviceLocationId = $_REQUEST['serviceLocationId'];
 } else {
  $serviceLocationId = NULL;
 }

 if (validateParams('friendlyURL')) {
  $friendlyURL = $_REQUEST['friendlyURL'];
 } else {
  $friendlyURL = NULL;
 }

 if (validateParams('UID')) {
  $UID = $_REQUEST['UID'];
 } else {
  $UID = NULL;
 }

 if (validateParams('t')) {
  $type = $_REQUEST['t'];
 } else {
  $type = NULL;
 }

 if (validateParams('u')) {
  $uuidURL = $_REQUEST['u'];
 } else {
  $uuidURL = NULL;
 }

 /* NOTE: if debug=true then PHP will echo variables and exit */
 if (validateParams('debug')) {
  $debug = TRUE;
 } else {
  $debug = FALSE;
 }

 if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
  $saslAccess = TRUE;
 } else {
  $saslAccess = FALSE;
 }

 if (!is_null($friendlyURL)) {
  $urlKeyAccess = TRUE;
 } else {
  $urlKeyAccess = FALSE;
 }

 if ($debug) {
  echo '$completeURL=' . $completeURL . "</br>";
  echo '$serverName=' . $serverName . "</br>";

  echo '$friendlyURL=' . $friendlyURL . "</br>";
  echo '$server=' . $server . "</br>";
  echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
  echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";
  echo '$serviceAccommodatorId=' . $serviceAccommodatorId . "</br>";
  echo '$serviceLocationId=' . $serviceLocationId . "</br>";

  echo '$UID=' . $UID . "</br>";
  echo '$saslAccess=' . $saslAccess . "</br>";
  echo '$urlKeyAccess=' . $urlKeyAccess . "</br>";
  echo '$desktopIFrame=' . $desktopIFrame . "</br>";
  if (!is_null($friendlyURL)) {
   echo '$friendlyURL is ' . $friendlyURL . "</br>";
   ;
  } else if ((!is_null($serviceAccommodatorId)) && (!is_null($serviceLocationId))) {
   echo '$serviceAccommodatorId is ' . $serviceAccommodatorId . ' and $serviceLocationId is ' . $serviceLocationId;
  } else {
   echo ' root case ';
  }

  return;
 }

 $errorMessage = NULL;
 $saslName = NULL;
 $appleTouchIcon60URL = NULL;

 $isPrivate = FALSE;
 $canCreateAnonymousUser = TRUE;

 /*
  * make api call for retrieving chalkboards divs
  */

 $apiURL = $protocol . $server . "/apptsvc/rest/html/retrieveTileView";

 $siteletteJSON = makeApiCall($apiURL);
 $themeId = '2';
 $domain = 'UNDEFINED';
 $themeCSS = 'styles.css';

 include_once ('chalkboards.php');
}
?>